package com.worthmate.service;

import com.worthmate.dto.AuthRequest;
import com.worthmate.dto.AuthResponse;
import com.worthmate.entity.User;
import com.worthmate.entity.UserRole;
import com.worthmate.exception.ResourceAlreadyExistsException;
import com.worthmate.exception.InvalidCredentialsException;
import com.worthmate.repository.UserRepository;
import com.worthmate.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse signupUser(AuthRequest authRequest, String firstName, String lastName, String phoneNumber) {
        if (userRepository.existsByEmail(authRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .email(authRequest.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(phoneNumber)
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .role(UserRole.USER)
                .isActive(true)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getId());

        return generateAuthResponse(user);
    }

    public AuthResponse signupMentor(AuthRequest authRequest, String firstName, String lastName, String phoneNumber) {
        if (userRepository.existsByEmail(authRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .email(authRequest.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(phoneNumber)
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .role(UserRole.MENTOR)
                .isActive(true)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);
        log.info("Mentor registered successfully: {}", user.getId());

        return generateAuthResponse(user);
    }

    public AuthResponse login(AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            String accessToken = jwtTokenProvider.generateToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authRequest.getEmail());

            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new InvalidCredentialsException("User not found"));

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole().name())
                    .build();
        } catch (Exception ex) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidCredentialsException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        String newAccessToken = jwtTokenProvider.generateTokenFromUsername(username);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(username);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateTokenFromUsername(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }
}
