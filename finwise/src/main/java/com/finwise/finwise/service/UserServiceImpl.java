package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.User;
import com.finwise.finwise.repo.UserRepository;
import com.finwise.finwise.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found with ID: " + userId));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found with email: " + email));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long userId, User updatedUser) {

        User existingUser = getUserById(userId);

        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setPhone(updatedUser.getPhone());

        return userRepository.save(existingUser);
    }
}