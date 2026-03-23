package com.worthmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorDTO {
    private String id;
    private String userId;
    private String title;
    private String description;
    private Integer yearsOfExperience;
    private BigDecimal hourlyRate;
    private String status;
    private Boolean isAvailable;
    private Double averageRating;
    private Integer totalReviews;
    private BigDecimal totalEarnings;
    private Integer totalCalls;
    private String certifications;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> specializations;
    private UserDTO user;
}

@Data
class MentorProfileUpdateRequest {
    private String title;
    private String description;
    private Integer yearsOfExperience;
    private BigDecimal hourlyRate;
    private String certifications;
    private List<String> specializations;
}

@Data
class MentorListResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String title;
    private Integer yearsOfExperience;
    private BigDecimal hourlyRate;
    private Double averageRating;
    private Integer totalReviews;
    private List<String> specializations;
    private Boolean isAvailable;
}

@Data
class MentorEarningsDTO {
    private BigDecimal totalEarnings;
    private Integer totalCalls;
    private BigDecimal averageEarningsPerCall;
    private Integer completedCalls;
    private Integer upcomingCalls;
    private LocalDateTime lastPaymentDate;
}
