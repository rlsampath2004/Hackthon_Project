package com.finwise.finwise.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finwise.finwise.dto.LoginRequest;
import com.finwise.finwise.dto.RegisterRequest;
import com.finwise.finwise.entity.User;
import com.finwise.finwise.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor injection
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestBody RegisterRequest request) {

        User user = authService.registerUser(request);

        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "userId", user.getUserId(),
                "fullName", user.getFullName(),
                "email", user.getEmail()
        ));
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(
            @RequestBody LoginRequest request) {

        String token = authService.loginUser(request);

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", token
        ));
    }
}