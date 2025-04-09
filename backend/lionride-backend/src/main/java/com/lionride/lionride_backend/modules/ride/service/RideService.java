package com.lionride.lionride_backend.modules.ride.service;

import com.lionride.lionride_backend.modules.ride.model.Ride;
import com.lionride.lionride_backend.modules.ride.repository.RideRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private RestTemplate restTemplate;

    // Load the Google Maps API key from the environment variable
    private final String googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY");

    public Ride requestRide(Ride ride) {
        if (googleMapsApiKey == null) {
            throw new IllegalStateException("Google Maps API key not configured");
        }

        try {
            String pickup = URLEncoder.encode(ride.getPickupAddress(), StandardCharsets.UTF_8);
            String destination = URLEncoder.encode(ride.getDestinationAddress(), StandardCharsets.UTF_8);

            String url = "https://maps.googleapis.com/maps/api/distancematrix/json"
                    + "?origins=" + pickup
                    + "&destinations=" + destination
                    + "&key=" + googleMapsApiKey;

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map element = getElement(response);

            Map distanceMap = (Map) element.get("distance");
            Map durationMap = (Map) element.get("duration");
            if (distanceMap == null || durationMap == null) {
                throw new RuntimeException("Missing distance/duration in response");
            }

            Long distanceInMeters = ((Number) distanceMap.get("value")).longValue();
            Long durationInSeconds = ((Number) durationMap.get("value")).longValue();

            BigDecimal estimatedFare = calculateFare(distanceInMeters, durationInSeconds);
            ride.setEstimatedFare(estimatedFare);

        } catch (Exception e) { // Catch specific exceptions

            ride.setEstimatedFare(new BigDecimal("5.00")); // Fallback
        }

        if (ride.getStatus() == null) {
            ride.setStatus("Pending");
        }
        LocalDateTime now = LocalDateTime.now();
        ride.setCreatedAt(now);
        ride.setUpdatedAt(now);

        return rideRepository.save(ride);
    }

    private static Map getElement(ResponseEntity<Map> response) {
        Map body = response.getBody();

        if (body == null) {
            throw new RuntimeException("Empty API response");
        }

        List rows = (List) body.get("rows");
        if (rows == null || rows.isEmpty()) {
            throw new RuntimeException("No rows in API response");
        }

        Map firstRow = (Map) rows.get(0);
        List elements = (List) firstRow.get("elements");
        if (elements == null || elements.isEmpty()) {
            throw new RuntimeException("No elements in row");
        }

        Map element = (Map) elements.get(0);
        return element;
    }

    private BigDecimal calculateFare(Long distanceInMeters, Long durationInSeconds) {
        BigDecimal baseFare = new BigDecimal("5.00");
        BigDecimal ratePerKm = new BigDecimal("0.50");
        BigDecimal ratePerMinute = new BigDecimal("0.25");

        BigDecimal distanceInKm = new BigDecimal(distanceInMeters)
                .divide(new BigDecimal("1000"), 2, RoundingMode.HALF_UP);

        BigDecimal durationInMinutes = new BigDecimal(durationInSeconds)
                .divide(new BigDecimal("60"), 2, RoundingMode.HALF_UP);

        return baseFare
                .add(distanceInKm.multiply(ratePerKm))
                .add(durationInMinutes.multiply(ratePerMinute));
    }

    public Ride getRide(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new NoSuchElementException("Ride not found with id: " + rideId));
    }

    public Ride updateRideStatus(Long rideId, String status) {
        Ride ride = getRide(rideId);
        ride.setStatus(status);
        ride.setUpdatedAt(LocalDateTime.now());
        return rideRepository.save(ride);
    }

    public List<Ride> getRideHistory(String riderUid) {
        return rideRepository.findTop5ByRiderUidAndStatusOrderByCreatedAtDesc(riderUid, "Completed");
    }

    @Transactional
    public Ride acceptRide(Long rideId, String driverUid) {
        // Fetch the ride record
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new NoSuchElementException("Ride not found with id: " + rideId));

        // Check if ride is still in a status where it can be accepted (e.g., "Requested")
        if (!"Requested".equals(ride.getStatus())) {
            throw new IllegalStateException("Ride already accepted or not available for acceptance");
        }

        // Update ride with driver's UID and new status
        ride.setDriverUid(driverUid);
        ride.setStatus("Accepted");
        ride.setUpdatedAt(LocalDateTime.now());

        try {
            return rideRepository.save(ride);
        } catch (OptimisticLockingFailureException e) {
            throw new RuntimeException("Ride was updated by another request. Please try again.", e);
        }
    }

    public List<Ride> getAvailableRides() {
        return rideRepository.findByStatus("Requested");
    }
}
