package com.lionride.lionride_backend.modules.ride.service;

import com.lionride.lionride_backend.modules.ride.model.Ride;
import com.lionride.lionride_backend.modules.ride.repository.RideRepository;
import com.lionride.lionride_backend.utility.Coordinates;
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
import java.util.HashMap;
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

    @Transactional
    public Ride startRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new NoSuchElementException("Ride not found with id: " + rideId));

        if (!"Accepted".equals(ride.getStatus())) {
            throw new IllegalStateException("Ride cannot be started unless it is accepted");
        }
        ride.setStatus("InProgress");
        ride.setStartTime(LocalDateTime.now());
        ride.setUpdatedAt(LocalDateTime.now());
        return rideRepository.save(ride);
    }

    @Transactional
    public Ride completeRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new NoSuchElementException("Ride not found with id: " + rideId));

        if (!"InProgress".equals(ride.getStatus())) {
            throw new IllegalStateException("Ride cannot be completed unless it is in progress");
        }
        ride.setStatus("Completed");
        ride.setEndTime(LocalDateTime.now());
        ride.setUpdatedAt(LocalDateTime.now());
        return rideRepository.save(ride);
    }

    public List<Ride> getAvailableRides() {
        return rideRepository.findByStatus("Requested");
    }

    public Map<String, Object> getRideProgress(Long rideId) throws Exception {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new NoSuchElementException("Ride not found with id: " + rideId));

        // Obtain coordinates for pickup and destination via geocoding.
        Coordinates pickupCoords = geocodeAddress(ride.getPickupAddress());
        Coordinates destinationCoords = geocodeAddress(ride.getDestinationAddress());
        // Since the driver's real location is not stored, simulate it.
        Coordinates driverInitialLocation = getDriverCurrentLocation(ride.getDriverUid());

        double startLat, startLng, endLat, endLng;

        if ("Accepted".equals(ride.getStatus())) {
            // Simulate the route from the driver's initial (real) location to the pickup.
            startLat = driverInitialLocation.getLat();
            startLng = driverInitialLocation.getLng();
            endLat = pickupCoords.getLat();
            endLng = pickupCoords.getLng();
        } else if ("InProgress".equals(ride.getStatus())) {
            // Simulate the route from the pickup to the destination.
            startLat = pickupCoords.getLat();
            startLng = pickupCoords.getLng();
            endLat = destinationCoords.getLat();
            endLng = destinationCoords.getLng();
        } else {
            startLat = endLat = startLng = endLng = 0;
        }

        // For demonstration, simulate the driver's current location as the midpoint.
        double currentLat = (startLat + endLat) / 2;
        double currentLng = (startLng + endLng) / 2;

        Map<String, Object> progress = new HashMap<>();
        progress.put("rideStatus", ride.getStatus());
        Map<String, Double> driverLocation = new HashMap<>();
        driverLocation.put("lat", currentLat);
        driverLocation.put("lng", currentLng);
        progress.put("driverLocation", driverLocation);
        progress.put("pickupAddress", ride.getPickupAddress());
        progress.put("destinationAddress", ride.getDestinationAddress());
        progress.put("eta", "5 mins"); // Demo ETA
        return progress;
    }

    private Coordinates geocodeAddress(String address) throws Exception {
        String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                + encodedAddress + "&key=" + googleMapsApiKey;

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map body = response.getBody();
        if (body == null) {
            throw new Exception("Empty geocoding response");
        }
        List results = (List) body.get("results");
        if (results == null || results.isEmpty()) {
            throw new Exception("No geocoding results for address: " + address);
        }
        Map firstResult = (Map) results.get(0);
        Map geometry = (Map) firstResult.get("geometry");
        Map location = (Map) geometry.get("location");
        double lat = ((Number) location.get("lat")).doubleValue();
        double lng = ((Number) location.get("lng")).doubleValue();
        return new Coordinates(lat, lng);
    }

    private Coordinates getDriverCurrentLocation(String driverUid) {
        // For demo purposes, since we don't have the driver's location,
        // return a constant coordinate (e.g., San Francisco).
        return new Coordinates(39.8036, -75.9229);
    }
}
