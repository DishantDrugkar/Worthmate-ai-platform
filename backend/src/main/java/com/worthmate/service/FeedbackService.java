package com.worthmate.service;

import com.worthmate.dto.FeedbackDTO;
import com.worthmate.entity.Feedback;
import com.worthmate.entity.Booking;
import com.worthmate.entity.BookingStatus;
import com.worthmate.exception.ResourceNotFoundException;
import com.worthmate.repository.FeedbackRepository;
import com.worthmate.repository.BookingRepository;
import com.worthmate.repository.UserRepository;
import com.worthmate.repository.MentorProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private MentorService mentorService;

    public FeedbackDTO submitFeedback(String bookingId, Integer rating, String comment,
                                      Boolean wouldRecommend, Boolean wasHelpful, String keyTakeaways) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (feedbackRepository.findByBookingId(bookingId).isPresent()) {
            throw new IllegalArgumentException("Feedback already submitted for this booking");
        }

        Feedback feedback = Feedback.builder()
                .booking(booking)
                .user(booking.getUser())
                .mentor(booking.getMentor())
                .rating(rating)
                .comment(comment)
                .wouldRecommend(wouldRecommend)
                .wasHelpful(wasHelpful)
                .keyTakeaways(keyTakeaways)
                .build();

        feedback = feedbackRepository.save(feedback);
        booking.setIsFeedbackSubmitted(true);
        bookingRepository.save(booking);

        // Update mentor rating
        mentorService.updateMentorRating(booking.getMentor().getId(), rating);

        log.info("Feedback submitted for booking: {}", bookingId);

        return convertToDTO(feedback);
    }

    public FeedbackDTO getFeedbackByBookingId(String bookingId) {
        Feedback feedback = feedbackRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        return convertToDTO(feedback);
    }

    public List<FeedbackDTO> getMentorFeedbacks(String mentorId) {
        return feedbackRepository.findByMentorId(mentorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getUserFeedbacks(String userId) {
        return feedbackRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Double getMentorAverageRating(String mentorId) {
        List<Feedback> feedbacks = feedbackRepository.findByMentorId(mentorId);
        if (feedbacks.isEmpty()) return 0.0;

        double average = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        return Math.round(average * 10.0) / 10.0;
    }

    private FeedbackDTO convertToDTO(Feedback feedback) {
        return FeedbackDTO.builder()
                .id(feedback.getId())
                .bookingId(feedback.getBooking().getId())
                .userId(feedback.getUser().getId())
                .mentorId(feedback.getMentor().getId())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .wouldRecommend(feedback.getWouldRecommend())
                .wasHelpful(feedback.getWasHelpful())
                .keyTakeaways(feedback.getKeyTakeaways())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
