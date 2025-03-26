package com.lionride.lionride_backend.modules.user.controller;

import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.user.model.User;
import com.lionride.lionride_backend.modules.user.model.UserType;
import com.lionride.lionride_backend.modules.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/v1/users")
public class UserController {
    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            // 1. Extract the Firebase ID token from the header.
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String idToken = authHeader.substring(7);

            // 2. Verify the token using FirebaseAuthService.
            FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(idToken);

            // 3. Extract common user details from the token.
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            // 4. Parse additional profile details from the request body.
            String firstName = payload.get("firstName");
            String lastName = payload.get("lastName");
            String phoneNumber = payload.get("phoneNumber");
            String userTypeString = payload.get("userType"); // expected values: "DRIVER" or "RIDER"
            UserType userType = UserType.valueOf(userTypeString.toUpperCase());

            // 5. Create or update the user record.
            User user = userService.registerOrUpdateUser(uid, email, firstName, lastName, phoneNumber, userType);

            // 6. Return a success response with the user object.
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Error during registration: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            // 1. Extract the token.
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String idToken = authHeader.substring(7);

            // 2. Verify the token.
            FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            // 3. Retrieve the user record.
            User user = userService.getUser(uid);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            // 4. Return the user profile.
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Error retrieving profile: " + e.getMessage());
        }
    }
}
