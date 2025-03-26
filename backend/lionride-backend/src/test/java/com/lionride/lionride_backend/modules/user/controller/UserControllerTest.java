package com.lionride.lionride_backend.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseToken;
import com.lionride.lionride_backend.firebase.service.FirebaseAuthService;
import com.lionride.lionride_backend.modules.user.model.User;
import com.lionride.lionride_backend.modules.user.model.UserType;
import com.lionride.lionride_backend.modules.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = UserController.class)
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private FirebaseAuthService firebaseAuthService;

    @MockitoBean
    private UserService userService;

    @Test
    public void testRegisterUser_success() throws Exception {
        // Arrange
        FirebaseToken fakeToken = Mockito.mock(FirebaseToken.class);
        Mockito.when(fakeToken.getUid()).thenReturn("testUID");
        Mockito.when(fakeToken.getEmail()).thenReturn("test@lincoln.edu");
        Mockito.when(firebaseAuthService.verifyIdToken(anyString())).thenReturn(fakeToken);

        Map<String, String> payload = new HashMap<>();
        payload.put("firstName", "John");
        payload.put("lastName", "Doe");
        payload.put("phoneNumber", "1234567890");
        payload.put("userType", "RIDER");

        User dummyUser = new User("testUID",  "John", "Doe", "test@lincoln.edu","1234567890", UserType.RIDER);
        Mockito.when(userService.registerUser(anyString(), anyString(), anyString(), anyString(), anyString(), any(UserType.class)))
                .thenReturn(dummyUser);

        // Act & Assert
        mockMvc.perform(post("/api/v1/users/register")
                        .header("Authorization", "Bearer dummyToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetProfile_success() throws Exception {
        // Arrange
        FirebaseToken fakeToken = Mockito.mock(FirebaseToken.class);
        Mockito.when(fakeToken.getUid()).thenReturn("testUID");
        Mockito.when(firebaseAuthService.verifyIdToken(anyString())).thenReturn(fakeToken);

        User dummyUser = new User("testUID",  "John", "Doe", "test@lincoln.edu","1234567890", UserType.RIDER);
        Mockito.when(userService.getUser("testUID")).thenReturn(dummyUser);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/profile")
                        .header("Authorization", "Bearer dummyToken"))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateProfile_success() throws Exception {
        // Arrange
        FirebaseToken fakeToken = Mockito.mock(FirebaseToken.class);
        Mockito.when(fakeToken.getUid()).thenReturn("testUID");
        Mockito.when(firebaseAuthService.verifyIdToken(anyString())).thenReturn(fakeToken);

        // Simulate existing user retrieval
        User existingUser = new User("testUID", "John", "Doe", "test@lincoln.edu","1234567890", UserType.RIDER);
        Mockito.when(userService.getUser("testUID")).thenReturn(existingUser);

        // Prepare payload for update (e.g., change first name and userType)
        Map<String, String> payload = new HashMap<>();
        payload.put("firstName", "Johnny");
        payload.put("lastName", "Doe");
        payload.put("phoneNumber", "0987654321");
        // Changing role from RIDER to DRIVER should trigger merge logic and update to BOTH
        payload.put("userType", "DRIVER");

        // Simulate update logic: return a user with merged role (BOTH) and updated details
        User updatedUser = new User("testUID", "test@lincoln.edu", "Johnny", "Doe", "0987654321", UserType.BOTH);
        Mockito.when(userService.updateUser(anyString(), anyString(), anyString(), anyString(), any(UserType.class)))
                .thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/api/v1/users/profile")
                        .header("Authorization", "Bearer dummyToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());
    }
}