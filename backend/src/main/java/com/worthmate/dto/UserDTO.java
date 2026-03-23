package com.worthmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String role;
    private String profilePicture;
    private String bio;
    private Boolean emailVerified;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
class UserProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profilePicture;
    private String bio;
}

@Data
class UserPublicProfileDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String bio;
}
