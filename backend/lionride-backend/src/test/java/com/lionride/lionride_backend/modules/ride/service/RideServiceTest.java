package com.lionride.lionride_backend.modules.ride.service;

import com.lionride.lionride_backend.modules.ride.model.Ride;
import com.lionride.lionride_backend.modules.ride.repository.RideRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class RideServiceTest {
    @Mock
    private RideRepository rideRepository;

    @InjectMocks
    private RideService rideService;

    @BeforeEach
    void setUp() throws NoSuchFieldException, IllegalAccessException {
        MockitoAnnotations.openMocks(this);

        var apiKeyField = RideService.class.getDeclaredField("googleMapsApiKey");
        apiKeyField.setAccessible(true);
        apiKeyField.set(rideService, "dummy_key");
    }

    @Test
    void getRide_existingId_returnsRide() {
        Ride mockRide = new Ride();
        mockRide.setRideId(1L);
        when(rideRepository.findById(1L)).thenReturn(Optional.of(mockRide));

        Ride ride = rideService.getRide(1L);
        assertEquals(1L, ride.getRideId());
    }

    @Test
    void updateRideStatus_updatesStatusAndTimestamps() {
        Ride mockRide = new Ride();
        mockRide.setRideId(1L);
        mockRide.setStatus("Pending");
        when(rideRepository.findById(1L)).thenReturn(Optional.of(mockRide));
        when(rideRepository.save(any(Ride.class))).thenReturn(mockRide);

        Ride updated = rideService.updateRideStatus(1L, "Requested");
        assertEquals("Requested", updated.getStatus());
    }

    @Test
    void requestRide_setsFareAndStatus() {
        Ride input = new Ride();
        input.setPickupAddress("A");
        input.setDestinationAddress("B");

        when(rideRepository.save(any(Ride.class))).thenAnswer(invocation -> {
            Ride r = invocation.getArgument(0);
            r.setRideId(1L);
            return r;
        });

        Ride result = rideService.requestRide(input);
        assertEquals("Pending", result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getEstimatedFare());
    }

    @Test
    void completeRide_validTransition_successful() {
        Ride inProgress = new Ride();
        inProgress.setStatus("InProgress");
        when(rideRepository.findById(1L)).thenReturn(Optional.of(inProgress));
        when(rideRepository.save(any(Ride.class))).thenReturn(inProgress);

        Ride completed = rideService.completeRide(1L);
        assertEquals("Completed", completed.getStatus());
        assertNotNull(completed.getEndTime());
    }

    @Test
    void startRide_validTransition_successful() {
        Ride accepted = new Ride();
        accepted.setStatus("Accepted");
        when(rideRepository.findById(1L)).thenReturn(Optional.of(accepted));
        when(rideRepository.save(any(Ride.class))).thenReturn(accepted);

        Ride started = rideService.startRide(1L);
        assertEquals("InProgress", started.getStatus());
        assertNotNull(started.getStartTime());
    }
}