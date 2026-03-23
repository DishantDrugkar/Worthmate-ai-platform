package com.worthmate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "calls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Call {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false)
    private String agoraChannelName;

    @Column(nullable = false)
    private String agoraUserIdMentor;

    @Column(nullable = false)
    private String agoraUserIdUser;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer actualDurationSeconds = 0;

    @Column(columnDefinition = "TEXT")
    private String recordingUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRecorded = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CallStatus status = CallStatus.PENDING;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
