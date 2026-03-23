package com.worthmate.controller;

import com.worthmate.dto.UserDTO;
import com.worthmate.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "User profile management")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get current user profile", description = "Retrieve logged-in user's profile")
    public ResponseEntity<UserDTO> getCurrentProfile() {
        UserDTO user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user public profile", description = "Get public profile of any user")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable String userId) {
        UserDTO user = userService.getUserProfile(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update user profile", description = "Update current user's profile information")
    public ResponseEntity<UserDTO> updateProfile(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String profilePicture,
            @RequestParam(required = false) String bio) {
        
        String userId = userService.getCurrentUser().getId();
        UserDTO updatedUser = userService.updateProfile(userId, firstName, lastName, phoneNumber, profilePicture, bio);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/account")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete user account", description = "Permanently delete user account")
    public ResponseEntity<String> deleteAccount() {
        String userId = userService.getCurrentUser().getId();
        userService.deleteAccount(userId);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
