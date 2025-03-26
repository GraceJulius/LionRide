package com.lionride.lionride_backend.modules.user.service;

import com.lionride.lionride_backend.modules.user.model.User;
import com.lionride.lionride_backend.modules.user.model.UserType;
import com.lionride.lionride_backend.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    /**
     * Registers a new user record.
     */
    public User registerUser(String uid, String email, String firstName, String lastName, String phoneNumber, UserType userType) {
        User user = new User();
        user.setUid(uid);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);
        user.setUserType(userType);
        return userRepository.save(user);
    }

    /**
     * Updates an existing user record.
     * If the new registration indicates a different role than the existing user,
     * updates the role to BOTH.
     */
    public User updateUser(String uid, String firstName, String lastName, String phoneNumber, UserType newUserType) {
        Optional<User> existingUserOptional = userRepository.findById(uid);
        if (existingUserOptional.isEmpty()) {
            throw new NoSuchElementException("User not found with uid: " + uid);
        }
        User user = existingUserOptional.get();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);
        // If the new role is different from the existing role, update to BOTH.
        if (!user.getUserType().equals(newUserType)) {
            user.setUserType(UserType.BOTH);
        } else {
            user.setUserType(newUserType);
        }
        return userRepository.save(user);
    }
    public User getUser(String uid) {
        return userRepository.findById(uid).orElse(null);
    }
}
