package com.lionride.lionride_backend.firebase.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {
    /**
     * Verifies the provided Firebase ID token and returns the decoded token.
     *
     * @param idToken the Firebase ID token to verify.
     * @return a FirebaseToken containing the token's payload (e.g., UID, email, etc.).
     * @throws Exception if the token is invalid or verification fails.
     */
    public FirebaseToken verifyIdToken(String idToken) throws Exception {
        return FirebaseAuth.getInstance().verifyIdToken(idToken);
    }
}
