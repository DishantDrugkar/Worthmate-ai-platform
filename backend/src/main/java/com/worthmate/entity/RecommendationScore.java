package com.worthmate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id", nullable = false)
    private Specialization specialization;

    @Column(nullable = false)
    private Integer score; // 0-100

    @Column(columnDefinition = "TEXT")
    private String reasoning; // AI-generated reasoning

    @Column(nullable = false)
    private Integer totalFeedbackCount;

    @Column(nullable = false)
    private Double successRate; // percentage

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
    }
}
