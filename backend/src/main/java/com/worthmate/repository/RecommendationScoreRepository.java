package com.worthmate.repository;

import com.worthmate.entity.RecommendationScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationScoreRepository extends JpaRepository<RecommendationScore, String> {
    Optional<RecommendationScore> findByBookingId(String bookingId);
    List<RecommendationScore> findByMentorIdAndSpecializationId(String mentorId, String specializationId);
}
