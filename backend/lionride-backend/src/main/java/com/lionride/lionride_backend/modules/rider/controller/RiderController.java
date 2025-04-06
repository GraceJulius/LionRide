package com.lionride.lionride_backend.modules.rider.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.rider.model.Rider;
import com.lionride.lionride_backend.modules.rider.service.RiderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/riders")
public class RiderController {

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private RiderService riderService;

    private String extractUid(HttpServletRequest request) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalStateException("Missing or invalid Authorization header");
        }
        String idToken = authHeader.substring(7);
        FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(idToken);
        return decodedToken.getUid();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerRider(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            String uid = extractUid(request);
            String defaultPaymentMethod = payload.get("defaultPaymentMethod");

            Rider rider = new Rider();
            rider.setUid(uid);
            rider.setDefaultPaymentMethod(defaultPaymentMethod);

            Rider savedRider = riderService.registerRider(rider);
            return ResponseEntity.ok(savedRider);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error registering rider: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getRiderProfile(HttpServletRequest request) {
        try {
            String uid = extractUid(request);
            Rider rider = riderService.getRiderByUid(uid);
            if (rider == null) {
                return ResponseEntity.status(404).body("Rider not found");
            }
            return ResponseEntity.ok(rider);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving rider profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateRiderProfile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            String uid = extractUid(request);
            String defaultPaymentMethod = payload.get("defaultPaymentMethod");
            Rider updatedRider = riderService.updateRider(uid, defaultPaymentMethod);
            return ResponseEntity.ok(updatedRider);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating rider profile: " + e.getMessage());
        }
    }
}
