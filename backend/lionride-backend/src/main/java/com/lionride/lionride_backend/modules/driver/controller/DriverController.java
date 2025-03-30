package com.lionride.lionride_backend.modules.driver.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.driver.model.Driver;
import com.lionride.lionride_backend.modules.driver.service.DriverService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {
    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private DriverService driverService;


    private String extractUidFromRequest(HttpServletRequest request) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalStateException("Missing or invalid Authorization header");
        }
        String idToken = authHeader.substring(7);
        FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(idToken);
        return decodedToken.getUid();
    }

    private Driver parseDriverDetails(Map<String, String> payload) {
        String vehicleMake = payload.get("vehicleMake");
        String vehicleModel = payload.get("vehicleModel");
        int vehicleYear = Integer.parseInt(payload.get("vehicleYear"));
        String licensePlate = payload.get("licensePlate");
        String driverLicenseNumber = payload.get("driverLicenseNumber");
        LocalDate licenseExpiry = LocalDate.parse(payload.get("licenseExpiry"));

        Driver driver = new Driver();
        driver.setVehicleMake(vehicleMake);
        driver.setVehicleModel(vehicleModel);
        driver.setVehicleYear(vehicleYear);
        driver.setLicensePlate(licensePlate);
        driver.setDriverLicenseNumber(driverLicenseNumber);
        driver.setLicenseExpiry(licenseExpiry);
        return driver;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerDriver(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            String uid = extractUidFromRequest(request);

            // Parse driver details from payload using helper method.
            Driver driverDetails = parseDriverDetails(payload);
            // Set the uid on the driver object.
            driverDetails.setUid(uid);

            // Register driver.
            Driver savedDriver = driverService.registerDriver(driverDetails);
            return ResponseEntity.ok(savedDriver);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error registering driver: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getDriverProfile(HttpServletRequest request) {
        try {
            String uid = extractUidFromRequest(request);
            Driver driver = driverService.getDriverByUid(uid);
            if (driver == null) {
                return ResponseEntity.status(404).body("Driver profile not found");
            }
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving driver profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateDriverProfile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            String uid = extractUidFromRequest(request);

            // Parse updated driver details from payload.
            Driver updatedDetails = parseDriverDetails(payload);

            // Update the driver record using the uid and parsed details.
            Driver updatedDriver = driverService.updateDriver(
                    uid,
                    updatedDetails.getVehicleMake(),
                    updatedDetails.getVehicleModel(),
                    updatedDetails.getVehicleYear(),
                    updatedDetails.getLicensePlate(),
                    updatedDetails.getDriverLicenseNumber(),
                    updatedDetails.getLicenseExpiry()
            );
            return ResponseEntity.ok(updatedDriver);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating driver profile: " + e.getMessage());
        }
    }
}
