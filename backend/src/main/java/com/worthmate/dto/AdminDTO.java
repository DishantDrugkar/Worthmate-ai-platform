package com.worthmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDTO {
}

@Data
class AdminUserListResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

@Data
class AdminMentorListResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String title;
    private String status;
    private Double averageRating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
}

@Data
class VerifyMentorRequest {
    private String mentorId;
    private Boolean approved;
    private String rejectionReason;
}

@Data
class PlatformAnalyticsDTO {
    private Long totalUsers;
    private Long totalMentors;
    private Long totalBookings;
    private Long completedCalls;
    private BigDecimal totalRevenue;
    private Double averageMentorRating;
    private Integer averageCallDuration;
    private LocalDateTime generatedAt;
}

@Data
class DisputeDTO {
    private String id;
    private String bookingId;
    private String userId;
    private String mentorId;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}
