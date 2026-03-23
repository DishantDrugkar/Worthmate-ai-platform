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
public class CallDTO {
    private String id;
    private String bookingId;
    private String agoraChannelName;
    private String agoraUserIdMentor;
    private String agoraUserIdUser;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer actualDurationSeconds;
    private String recordingUrl;
    private Boolean isRecorded;
    private String status;
    private LocalDateTime createdAt;
}

@Data
class GenerateAgoraTokenRequest {
    private String bookingId;
    private String userRole; // MENTOR or USER
}

@Data
class AgoraTokenResponse {
    private String token;
    private String channelName;
    private Integer userId;
    private String appId;
}

@Data
class EndCallRequest {
    private String bookingId;
    private Integer actualDurationSeconds;
    private String recordingUrl;
}

@Data
class CallRecordingResponse {
    private String recordingUrl;
    private String bookingId;
    private Integer durationSeconds;
}
