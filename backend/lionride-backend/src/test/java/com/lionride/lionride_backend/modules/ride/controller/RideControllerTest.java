package com.lionride.lionride_backend.modules.ride.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.ride.model.Ride;
import com.lionride.lionride_backend.modules.ride.service.RideService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RideControllerTest {
    @Mock
    private RideService rideService;

    @Mock
    private FirebaseAuthService firebaseAuthService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private RideController rideController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(request.getHeader("Authorization")).thenReturn("Bearer token123");
    }

    @Test
    void requestRide_success() throws Exception {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getUid()).thenReturn("user123");
        when(firebaseAuthService.verifyIdToken("token123")).thenReturn(token);

        Map<String, String> payload = new HashMap<>();
        payload.put("pickupAddress", "A");
        payload.put("destinationAddress", "B");

        Ride savedRide = new Ride();
        savedRide.setRideId(1L);
        when(rideService.requestRide(any())).thenReturn(savedRide);

        ResponseEntity<?> response = rideController.requestRide(request, payload);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getRide_found() {
        Ride ride = new Ride();
        ride.setRideId(1L);
        when(rideService.getRide(1L)).thenReturn(ride);

        ResponseEntity<?> response = rideController.getRide(1L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void updateRideStatus_validStatus_success() {
        Ride updated = new Ride();
        updated.setStatus("Cancelled");
        when(rideService.updateRideStatus(1L, "Cancelled")).thenReturn(updated);

        Map<String, String> payload = new HashMap<>();
        payload.put("status", "Cancelled");

        ResponseEntity<?> response = rideController.updateRideStatus(1L, payload);
        assertEquals("Cancelled", ((Ride) Objects.requireNonNull(response.getBody())).getStatus());
    }

    @Test
    void cancelRide_success() {
        Ride cancelled = new Ride();
        cancelled.setStatus("Cancelled");
        when(rideService.updateRideStatus(1L, "Cancelled")).thenReturn(cancelled);

        ResponseEntity<?> response = rideController.cancelRide(1L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Cancelled", ((Ride) Objects.requireNonNull(response.getBody())).getStatus());
    }
}