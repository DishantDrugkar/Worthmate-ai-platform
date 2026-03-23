package com.worthmate.repository;

import com.worthmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = 'MENTOR' AND u.isActive = true")
    java.util.List<User> findAllActiveMentors();
}

@Repository
interface MentorProfileRepository extends JpaRepository<MentorProfile, String> {
    Optional<MentorProfile> findByUserId(String userId);
    
    @Query("SELECT m FROM MentorProfile m WHERE m.status = 'VERIFIED' AND m.isAvailable = true")
    java.util.List<MentorProfile> findAllVerifiedAvailableMentors();
}

@Repository
interface BookingRepository extends JpaRepository<Booking, String> {
    java.util.List<Booking> findByUserId(String userId);
    java.util.List<Booking> findByMentorId(String mentorId);
    java.util.List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);
    java.util.List<Booking> findByMentorIdAndStatus(String mentorId, BookingStatus status);
}

@Repository
interface CallRepository extends JpaRepository<Call, String> {
    Optional<Call> findByBookingId(String bookingId);
}

@Repository
interface FeedbackRepository extends JpaRepository<Feedback, String> {
    Optional<Feedback> findByBookingId(String bookingId);
    java.util.List<Feedback> findByMentorId(String mentorId);
    java.util.List<Feedback> findByUserId(String userId);
}

@Repository
interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByBookingId(String bookingId);
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
    java.util.List<Payment> findByUserId(String userId);
}

@Repository
interface AvailabilityRepository extends JpaRepository<Availability, String> {
    java.util.List<Availability> findByMentorId(String mentorId);
}

@Repository
interface SpecializationRepository extends JpaRepository<Specialization, String> {
    java.util.List<Specialization> findByMentorId(String mentorId);
}

@Repository
interface RecommendationScoreRepository extends JpaRepository<RecommendationScore, String> {
    Optional<RecommendationScore> findByBookingId(String bookingId);
    java.util.List<RecommendationScore> findByMentorIdAndSpecializationId(String mentorId, String specializationId);
}
