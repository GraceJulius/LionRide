package com.lionride.lionride_backend.modules.user.service;

import com.lionride.lionride_backend.modules.user.model.User;
import com.lionride.lionride_backend.modules.user.model.UserType;
import com.lionride.lionride_backend.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerOrUpdateUser(String uid, String email, String firstName, String lastName, String phoneNumber, UserType newUserType) {
        Optional<User> existingUserOptional = userRepository.findById(uid);
        User user;
        if (existingUserOptional.isPresent()) {
            // Update existing user
            user = existingUserOptional.get();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhoneNumber(phoneNumber);
            // If the new registration indicates a different role, update to BOTH.
            if (!user.getUserType().equals(newUserType)) {
                user.setUserType(UserType.BOTH);
            } else {
                user.setUserType(newUserType);
            }
        } else {
            // Create a new user record
            user = new User();
            user.setUid(uid);
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhoneNumber(phoneNumber);
            user.setUserType(newUserType);
        }
        return userRepository.save(user);
    }
    public User getUser(String uid) {
        return userRepository.findById(uid).orElse(null);
    }
}
