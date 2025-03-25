package com.lionride.lionride_backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {
    @PostConstruct
    public void initialize() {
        try {
            String json = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
            if (json == null || json.isEmpty()) {
                throw new IllegalStateException("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.");
            }
            // Replace any escaped newline characters with actual newlines
            json = json.replace("\\n", "\n");
            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Failed to initialize Firebase: " + e.getMessage());
        }
    }
}
