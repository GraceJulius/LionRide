package com.lionride.lionride_backend.modules.ride.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.ride.model.Ride;
import com.lionride.lionride_backend.modules.ride.service.RideService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rides")
public class RideController {

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private RideService rideService;

    private String extractUid(HttpServletRequest request) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalStateException("Missing or invalid Authorization header");
        }
        String idToken = authHeader.substring(7);
        FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(idToken);
        return decodedToken.getUid();
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestRide(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            String riderUid = extractUid(request);
            Ride ride = new Ride();
            ride.setRiderUid(riderUid);
            ride.setPickupAddress(payload.get("pickupAddress"));
            ride.setDestinationAddress(payload.get("destinationAddress"));
            // RideService will calculate fare, set status ("Pending") and timestamps.
            Ride savedRide = rideService.requestRide(ride);
            return ResponseEntity.ok(savedRide);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error requesting ride: " + e.getMessage());
        }
    }

    @GetMapping("/{rideId}")
    public ResponseEntity<?> getRide(@PathVariable Long rideId) {
        try {
            Ride ride = rideService.getRide(rideId);
            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body("Ride not found: " + e.getMessage());
        }
    }

    @PutMapping("/{rideId}/status")
    public ResponseEntity<?> updateRideStatus(@PathVariable Long rideId, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            Ride updatedRide = rideService.updateRideStatus(rideId, status);
            return ResponseEntity.ok(updatedRide);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating ride status: " + e.getMessage());
        }
    }

    @PutMapping("/{rideId}/cancel")
    public ResponseEntity<?> cancelRide(@PathVariable Long rideId) {
        try {
            // Reuse the updateRideStatus method by setting the status to "Cancelled"
            Ride canceledRide = rideService.updateRideStatus(rideId, "Cancelled");
            return ResponseEntity.ok(canceledRide);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error canceling ride: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getRideHistory(HttpServletRequest request) {
        try {
            String riderUid = extractUid(request);
            // This method in RideService should return only completed rides.
            List<Ride> rideHistory = rideService.getRideHistory(riderUid);
            return ResponseEntity.ok(rideHistory);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving ride history: " + e.getMessage());
        }
    }
}
