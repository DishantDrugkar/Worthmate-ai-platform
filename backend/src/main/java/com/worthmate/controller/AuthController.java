package com.worthmate.controller;

import com.worthmate.dto.AuthRequest;
import com.worthmate.dto.AuthResponse;
import com.worthmate.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup/user")
    @Operation(summary = "Register as a user", description = "Create a new user account")
    public ResponseEntity<AuthResponse> signupUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String phoneNumber) {
        AuthRequest authRequest = AuthRequest.builder()
                .email(email)
                .password(password)
                .build();
        AuthResponse response = authService.signupUser(authRequest, firstName, lastName, phoneNumber);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signup/mentor")
    @Operation(summary = "Register as a mentor", description = "Create a new mentor account")
    public ResponseEntity<AuthResponse> signupMentor(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String phoneNumber) {
        AuthRequest authRequest = AuthRequest.builder()
                .email(email)
                .password(password)
                .build();
        AuthResponse response = authService.signupMentor(authRequest, firstName, lastName, phoneNumber);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and get JWT token")
    public ResponseEntity<AuthResponse> login(
            @RequestParam String email,
            @RequestParam String password) {
        AuthRequest authRequest = AuthRequest.builder()
                .email(email)
                .password(password)
                .build();
        AuthResponse response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT token", description = "Get new access token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestParam String refreshToken) {
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user (client-side token cleanup)")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}
