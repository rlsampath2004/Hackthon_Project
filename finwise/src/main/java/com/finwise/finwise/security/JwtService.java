
package com.finwise.finwise.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final SecretKey secretKey = Keys
			.hmacShaKeyFor("FinWiseSecretKeyForJwtTokenGeneration2026Secure".getBytes());

	private final long expirationTime = 86400000; // 24 hours

	// Generate JWT Token
	public String generateToken(String email) {

		return Jwts.builder().subject(email).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + expirationTime)).signWith(secretKey).compact();
	}

	// Extract Email from Token
	public String extractEmail(String token) {

		return extractAllClaims(token).getSubject();
	}

	// Validate JWT Token
	public boolean validateToken(String token, String email) {

		String extractedEmail = extractEmail(token);

		return extractedEmail.equals(email) && !isTokenExpired(token);
	}

	// Check Token Expiration
	private boolean isTokenExpired(String token) {

		return extractAllClaims(token).getExpiration().before(new Date());
	}

	// Extract All Claims
	private Claims extractAllClaims(String token) {

		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
	}
}