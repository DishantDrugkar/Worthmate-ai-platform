package com.worthmate.controller;

import com.worthmate.dto.AdminUserListResponse;
import com.worthmate.dto.AdminMentorListResponse;
import com.worthmate.dto.PlatformAnalyticsDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Admin dashboard and management")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    @GetMapping("/users")
    @Operation(summary = "List all users", description = "Get paginated list of all platform users")
    public ResponseEntity<List<AdminUserListResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Implementation would fetch from database
        List<AdminUserListResponse> users = new ArrayList<>();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/mentors")
    @Operation(summary = "List all mentors", description = "Get list of all mentors with verification status")
    public ResponseEntity<List<AdminMentorListResponse>> getAllMentors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Implementation would fetch from database
        List<AdminMentorListResponse> mentors = new ArrayList<>();
        return ResponseEntity.ok(mentors);
    }

    @PutMapping("/mentors/{mentorId}/verify")
    @Operation(summary = "Verify mentor", description = "Approve or reject mentor verification")
    public ResponseEntity<String> verifyMentor(
            @PathVariable String mentorId,
            @RequestParam Boolean approved,
            @RequestParam(required = false) String rejectionReason) {
        return ResponseEntity.ok("Mentor verification status updated");
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete user", description = "Permanently delete a user account")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics", description = "Get platform-wide analytics and metrics")
    public ResponseEntity<PlatformAnalyticsDTO> getAnalytics() {
        PlatformAnalyticsDTO analytics = PlatformAnalyticsDTO.builder()
                .totalUsers(0L)
                .totalMentors(0L)
                .totalBookings(0L)
                .completedCalls(0L)
                .averageMentorRating(0.0)
                .build();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/disputes")
    @Operation(summary = "Get disputes", description = "Get pending disputes for admin resolution")
    public ResponseEntity<String> getDisputes() {
        return ResponseEntity.ok("List of disputes");
    }
}
