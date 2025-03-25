package com.lionride.lionride_backend.firebase.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev")
@RestController
public class FirebaseTestController {
    @Autowired
    private FirebaseAuthService firebaseAuthService;

    /**
     * GET /api/test/verifyToken?token=YOUR_ID_TOKEN
     * Verifies a Firebase ID token and returns the decoded user information.
     */
    @GetMapping("/api/test/verifyToken")
    public ResponseEntity<String> verifyToken(@RequestParam String token) {
        try {
            FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(token);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            return ResponseEntity.ok("Token verified! UID: " + uid + ", Email: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token verification failed: " + e.getMessage());
        }
    }
}
