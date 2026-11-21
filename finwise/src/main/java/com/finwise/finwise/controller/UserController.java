package com.finwise.finwise.controller;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.User;
import com.finwise.finwise.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get User By ID
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(
            @PathVariable Long userId) {

        User user = userService.getUserById(userId);

        return ResponseEntity.ok(userResponse(user));
    }

    // Get User By Email
    @GetMapping("/email/{email}")
    public ResponseEntity<Map<String, Object>> getUserByEmail(
            @PathVariable String email) {

        User user = userService.getUserByEmail(email);

        return ResponseEntity.ok(userResponse(user));
    }

    // Get All Users
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {

        List<User> users = userService.getAllUsers();

        List<Map<String, Object>> response = users.stream()
                .map(this::userResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Update User
    @PutMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long userId,
            @RequestBody User updatedUser) {

        User user = userService.updateUser(userId, updatedUser);

        return ResponseEntity.ok(userResponse(user));
    }

    // Prepare safe user response without password
    private Map<String, Object> userResponse(User user) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("userId", user.getUserId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("createdAt", user.getCreatedAt());

        return response;
    }
}