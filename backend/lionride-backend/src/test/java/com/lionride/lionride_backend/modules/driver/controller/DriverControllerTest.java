package com.lionride.lionride_backend.modules.driver.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.driver.model.Driver;
import com.lionride.lionride_backend.modules.driver.service.DriverService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DriverControllerTest {
    @Mock
    private FirebaseAuthService firebaseAuthService;
    @Mock
    private DriverService driverService;

    @InjectMocks
    private DriverController controller;
    private HttpServletRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        request = mock(HttpServletRequest.class);
        when(request.getHeader("Authorization")).thenReturn("Bearer testToken");
    }

    @Test
    void registerDriver_success() throws Exception {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getUid()).thenReturn("uid123");
        when(firebaseAuthService.verifyIdToken("testToken")).thenReturn(token);

        Map<String, String> payload = new HashMap<>();
        payload.put("vehicleMake", "Toyota");
        payload.put("vehicleModel", "Camry");
        payload.put("vehicleYear", "2020");
        payload.put("licensePlate", "XYZ123");
        payload.put("driverLicenseNumber", "DL12345");
        payload.put("licenseExpiry", "2026-12-31");

        Driver savedDriver = new Driver();
        savedDriver.setUid("uid123");
        when(driverService.registerDriver(any(Driver.class))).thenReturn(savedDriver);

        ResponseEntity<?> response = controller.registerDriver(request, payload);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getDriverProfile_found() throws Exception {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getUid()).thenReturn("uid123");
        when(firebaseAuthService.verifyIdToken("testToken")).thenReturn(token);

        Driver driver = new Driver();
        driver.setUid("uid123");
        when(driverService.getDriverByUid("uid123")).thenReturn(driver);

        ResponseEntity<?> response = controller.getDriverProfile(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getDriverProfile_notFound() throws Exception {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getUid()).thenReturn("uid123");
        when(firebaseAuthService.verifyIdToken("testToken")).thenReturn(token);

        when(driverService.getDriverByUid("uid123")).thenReturn(null);

        ResponseEntity<?> response = controller.getDriverProfile(request);
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void updateDriverProfile_success() throws Exception {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getUid()).thenReturn("uid123");
        when(firebaseAuthService.verifyIdToken("testToken")).thenReturn(token);

        Map<String, String> payload = new HashMap<>();
        payload.put("vehicleMake", "Toyota");
        payload.put("vehicleModel", "Camry");
        payload.put("vehicleYear", "2020");
        payload.put("licensePlate", "XYZ123");
        payload.put("driverLicenseNumber", "DL12345");
        payload.put("licenseExpiry", "2026-12-31");

        Driver updated = new Driver();
        updated.setUid("uid123");

        when(driverService.updateDriver(any(), any(), any(), anyInt(), any(), any(), any()))
                .thenReturn(updated);

        ResponseEntity<?> response = controller.updateDriverProfile(request, payload);
        assertEquals(200, response.getStatusCode().value());
    }
}