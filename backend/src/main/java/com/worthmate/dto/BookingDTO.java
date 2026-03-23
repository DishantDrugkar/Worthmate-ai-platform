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
public class BookingDTO {
    private String id;
    private String userId;
    private String mentorId;
    private String specializationId;
    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private BigDecimal amount;
    private String status;
    private String userMessage;
    private Boolean isFeedbackSubmitted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MentorListResponse mentor;
    private FeedbackDTO feedback;
}

@Data
class CreateBookingRequest {
    private String mentorId;
    private String specializationId;
    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private String userMessage;
}

@Data
class UpdateBookingRequest {
    private String status; // CONFIRMED, CANCELLED
    private LocalDateTime newScheduledTime;
}

@Data
class BookingListResponse {
    private String id;
    private String mentorName;
    private String specialization;
    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private BigDecimal amount;
    private String status;
    private Boolean isFeedbackSubmitted;
}

@Data
class BookingDetailResponse {
    private String id;
    private MentorListResponse mentor;
    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private BigDecimal amount;
    private String status;
    private String userMessage;
    private Boolean isFeedbackSubmitted;
    private CallDTO call;
}
