package com.worthmate.service;

import com.worthmate.dto.RecommendationDTO;
import com.worthmate.dto.MentorRecommendation;
import com.worthmate.dto.RecommendationResponse;
import com.worthmate.entity.RecommendationScore;
import com.worthmate.entity.Feedback;
import com.worthmate.entity.MentorProfile;
import com.worthmate.entity.Specialization;
import com.worthmate.exception.ResourceNotFoundException;
import com.worthmate.repository.RecommendationScoreRepository;
import com.worthmate.repository.FeedbackRepository;
import com.worthmate.repository.MentorProfileRepository;
import com.worthmate.repository.SpecializationRepository;
import com.worthmate.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RecommendationService {

    @Autowired
    private RecommendationScoreRepository recommendationScoreRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public RecommendationDTO generateRecommendation(String bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        MentorProfile mentor = booking.getMentor();
        Specialization specialization = booking.getSpecialization();

        // Get all feedbacks for this mentor and specialization combination
        List<Feedback> feedbacks = feedbackRepository.findByMentorId(mentor.getId());

        int totalFeedback = feedbacks.size();
        int recommendCount = (int) feedbacks.stream()
                .filter(Feedback::getWouldRecommend)
                .count();

        int helpfulCount = (int) feedbacks.stream()
                .filter(Feedback::getWasHelpful)
                .count();

        double successRate = totalFeedback == 0 ? 0 : (helpfulCount * 100.0) / totalFeedback;
        
        int score = calculateRecommendationScore(
                mentor.getAverageRating(),
                successRate,
                recommendCount,
                totalFeedback
        );

        String reasoning = generateAIReasoning(mentor, specialization, score, successRate, totalFeedback);

        RecommendationScore recommendation = RecommendationScore.builder()
                .booking(booking)
                .mentor(mentor)
                .specialization(specialization)
                .score(score)
                .reasoning(reasoning)
                .totalFeedbackCount(totalFeedback)
                .successRate(successRate)
                .build();

        recommendation = recommendationScoreRepository.save(recommendation);
        log.info("Recommendation generated for booking: {}", bookingId);

        return convertToDTO(recommendation);
    }

    public RecommendationResponse getRecommendationsForMentor(String mentorId, String categoryId) {
        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        List<RecommendationScore> scores = recommendationScoreRepository
                .findByMentorIdAndSpecializationId(mentorId, categoryId);

        double avgScore = scores.isEmpty() ? 0 : 
                scores.stream().mapToInt(RecommendationScore::getScore).average().orElse(0);

        List<MentorRecommendation> recommendations = scores.stream()
                .map(score -> MentorRecommendation.builder()
                        .mentorId(mentor.getId())
                        .mentorName(mentor.getUser().getFirstName() + " " + mentor.getUser().getLastName())
                        .score(score.getScore())
                        .reasoning(score.getReasoning())
                        .shouldBook(score.getScore() >= 70)
                        .successRate((int) score.getSuccessRate().doubleValue())
                        .similarCasesCount(score.getTotalFeedbackCount())
                        .build())
                .collect(Collectors.toList());

        return RecommendationResponse.builder()
                .recommendations(recommendations)
                .generatedAt(LocalDateTime.now().toString())
                .build();
    }

    private int calculateRecommendationScore(double averageRating, double successRate, 
                                            int recommendCount, int totalFeedback) {
        if (totalFeedback == 0) return 0;

        // Weighted calculation
        double ratingScore = (averageRating / 5.0) * 40; // 40% weight
        double successScore = (successRate / 100.0) * 35; // 35% weight
        double recommendScore = (recommendCount * 100.0 / totalFeedback) * 25; // 25% weight

        int finalScore = (int) (ratingScore + successScore + recommendScore);
        return Math.min(100, Math.max(0, finalScore)); // Ensure 0-100 range
    }

    private String generateAIReasoning(MentorProfile mentor, Specialization specialization,
                                      int score, double successRate, int totalFeedback) {
        StringBuilder reasoning = new StringBuilder();

        reasoning.append(String.format("Based on %d past consultations, ", totalFeedback));
        reasoning.append(String.format("this mentor has a %.1f%% success rate. ", successRate));
        reasoning.append(String.format("Average rating: %.1f/5. ", mentor.getAverageRating()));

        if (score >= 80) {
            reasoning.append("Highly recommended for booking.");
        } else if (score >= 60) {
            reasoning.append("Good fit for your needs.");
        } else if (score >= 40) {
            reasoning.append("May be suitable, but consider other options.");
        } else {
            reasoning.append("Not recommended based on feedback.");
        }

        return reasoning.toString();
    }

    private RecommendationDTO convertToDTO(RecommendationScore recommendation) {
        return RecommendationDTO.builder()
                .id(recommendation.getId())
                .bookingId(recommendation.getBooking().getId())
                .mentorId(recommendation.getMentor().getId())
                .specializationId(recommendation.getSpecialization().getId())
                .score(recommendation.getScore())
                .reasoning(recommendation.getReasoning())
                .totalFeedbackCount(recommendation.getTotalFeedbackCount())
                .successRate(recommendation.getSuccessRate())
                .createdAt(recommendation.getCreatedAt())
                .build();
    }
}
