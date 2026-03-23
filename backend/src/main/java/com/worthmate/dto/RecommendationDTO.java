package com.worthmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDTO {
    private String id;
    private String bookingId;
    private String mentorId;
    private String specializationId;
    private Integer score; // 0-100
    private String reasoning;
    private Integer totalFeedbackCount;
    private Double successRate;
    private LocalDateTime createdAt;
}

@Data
class RecommendationScoreRequest {
    private String mentorId;
    private String categor yId;
}

@Data
class RecommendationResponse {
    private List<MentorRecommendation> recommendations;
    private String generatedAt;
}

@Data
class MentorRecommendation {
    private String mentorId;
    private String mentorName;
    private Integer score;
    private String reasoning;
    private Boolean shouldBook;
    private Integer successRate;
    private Integer similarCasesCount;
}

@Data
class AIRecommendationRequest {
    private String bookingId;
}
