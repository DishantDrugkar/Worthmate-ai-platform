package com.worthmate.repository;

import com.worthmate.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    Optional<Feedback> findByBookingId(String bookingId);
    List<Feedback> findByMentorId(String mentorId);
    List<Feedback> findByUserId(String userId);
}
