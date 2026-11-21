package com.finwise.finwise.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.finwise.finwise.dto.LoginRequest;
import com.finwise.finwise.dto.RegisterRequest;
import com.finwise.finwise.entity.User;
import com.finwise.finwise.repo.UserRepository;
import com.finwise.finwise.security.JwtService;
import com.finwise.finwise.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {

		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	
	public User registerUser(RegisterRequest request) {

		String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
		if (userRepository.existsByEmail(cleanEmail)) {
			throw new RuntimeException("Email is already registered. Please log in.");
		}

		User user = new User();

		user.setFullName(request.getFullName() != null ? request.getFullName().trim() : "");
		user.setEmail(cleanEmail);
		user.setPhone(request.getPhone() != null ? request.getPhone().trim() : "");
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		return userRepository.save(user);
	}

	
	public String loginUser(LoginRequest request) {

		String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
		User user = userRepository.findByEmail(cleanEmail)
				.orElseThrow(() -> new RuntimeException("No account registered with email '" + cleanEmail + "'. Please register first."));

		boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
		if (!matches && request.getPassword() != null && request.getPassword().equals(user.getPassword())) {
			user.setPassword(passwordEncoder.encode(request.getPassword()));
			userRepository.save(user);
			matches = true;
		}

		if (!matches) {
			throw new RuntimeException("Invalid password. Please check your credentials.");
		}

		return jwtService.generateToken(user.getEmail());
	}
}