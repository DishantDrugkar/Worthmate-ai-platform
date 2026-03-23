package com.worthmate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "mentor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer yearsOfExperience;

    @Column(nullable = false)
    private BigDecimal hourlyRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MentorStatus status = MentorStatus.PENDING_VERIFICATION;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(nullable = false)
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalCalls = 0;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL)
    private Set<Specialization> specializations = new HashSet<>();

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL)
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL)
    private Set<Availability> availabilities = new HashSet<>();

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL)
    private Set<Feedback> feedbacks = new HashSet<>();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
