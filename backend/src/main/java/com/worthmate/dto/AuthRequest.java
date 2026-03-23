package com.worthmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password should be at least 8 characters")
    private String password;
}

@Data
class SignupRequest extends AuthRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String role; // USER or MENTOR
}

@Data
class LoginRequest extends AuthRequest {
}

@Data
class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}

@Data
class PasswordResetRequest {
    @Email(message = "Email should be valid")
    private String email;
}

@Data
class PasswordResetConfirmRequest {
    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password should be at least 8 characters")
    private String newPassword;
}
