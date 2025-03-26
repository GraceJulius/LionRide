package com.lionride.lionride_backend.modules.user.service;

import com.lionride.lionride_backend.modules.user.model.User;
import com.lionride.lionride_backend.modules.user.model.UserType;
import com.lionride.lionride_backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    private final String UID = "testUID";
    private final String EMAIL = "test@lincoln.edu";
    private final String FIRST_NAME = "John";
    private final String LAST_NAME = "Doe";
    private final String PHONE = "1234567890";

    private User dummyUser;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        // Create a dummy user instance once before each test
        dummyUser = new User(UID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, UserType.RIDER);
    }

    @Test
    public void testRegisterUser_NewUser() {
        // When saving, return the dummy user
        when(userRepository.save(any(User.class))).thenReturn(dummyUser);

        // Call registerUser method
        User result = userService.registerUser(UID, EMAIL, FIRST_NAME, LAST_NAME, PHONE, UserType.RIDER);

        // Verify interactions and assert results
        verify(userRepository).save(any(User.class));
        assertEquals(UID, result.getUid());
        assertEquals(UserType.RIDER, result.getUserType());
    }

    @Test
    public void testUpdateUser_SameRole() {
        // Simulate that the user already exists
        when(userRepository.findById(UID)).thenReturn(Optional.of(dummyUser));
        // When saving, return the updated user
        when(userRepository.save(any(User.class))).thenReturn(dummyUser);

        // Call updateUser with new details but the same role (RIDER)
        User result = userService.updateUser(UID, "Johnny", LAST_NAME, "0987654321", UserType.RIDER);

        verify(userRepository).save(any(User.class));
        assertEquals("Johnny", result.getFirstName());
        assertEquals("0987654321", result.getPhoneNumber());
        assertEquals(UserType.RIDER, result.getUserType());
    }

    @Test
    public void testUpdateUser_DifferentRole() {
        // Simulate that the user already exists
        when(userRepository.findById(UID)).thenReturn(Optional.of(dummyUser));
        // When saving, return the updated user
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call updateUser with a different role (DRIVER)
        User result = userService.updateUser(UID, FIRST_NAME, LAST_NAME, PHONE, UserType.DRIVER);

        verify(userRepository).save(any(User.class));
        // If the roles differ, the logic sets the user type to BOTH
        assertEquals(UserType.BOTH, result.getUserType());
    }

    @Test
    void testGetUser_found() {
        // Given
        String uid = "testUID";
        when(userRepository.findById(uid)).thenReturn(Optional.of(dummyUser));

        // When
        User user = userService.getUser(uid);

        // Then
        assertNotNull(user, "User should not be null when found");
        assertEquals(uid, user.getUid(), "UID should match");
        assertEquals("test@lincoln.edu", user.getEmail(), "Email should match");
    }

    @Test
    public void testGetUser_notFound() {
        // Given
        String uid = "nonexistentUID";
        when(userRepository.findById(uid)).thenReturn(Optional.empty());

        // When
        User user = userService.getUser(uid);

        // Then
        assertNull(user, "User should be null when not found");
    }
}