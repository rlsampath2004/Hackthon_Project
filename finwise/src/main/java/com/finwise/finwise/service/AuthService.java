package com.finwise.finwise.service;

import com.finwise.finwise.dto.LoginRequest;
import com.finwise.finwise.dto.RegisterRequest;
import com.finwise.finwise.entity.User;

public interface AuthService {

    User registerUser(RegisterRequest request);

    String loginUser(LoginRequest request);
}