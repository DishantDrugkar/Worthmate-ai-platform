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
public class FeedbackDTO {
    private String id;
    private String bookingId;
    private String userId;
    private String mentorId;
    private Integer rating;
    private String comment;
    private Boolean wouldRecommend;
    private Boolean wasHelpful;
    private String keyTakeaways;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
class CreateFeedbackRequest {
    private String bookingId;
    private Integer rating; // 1-5
    private String comment;
    private Boolean wouldRecommend;
    private Boolean wasHelpful;
    private String keyTakeaways;
}

@Data
class FeedbackListResponse {
    private String id;
    private String userName;
    private Integer rating;
    private String comment;
    private Boolean wouldRecommend;
    private LocalDateTime createdAt;
}

@Data
class MentorFeedbackSummary {
    private Double averageRating;
    private Integer totalFeedbacks;
    private Integer recommendationCount;
    private Integer helpfulCount;
}
