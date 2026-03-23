package com.worthmate.service;

import com.worthmate.dto.BookingDTO;
import com.worthmate.entity.*;
import com.worthmate.exception.ResourceNotFoundException;
import com.worthmate.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public BookingDTO createBooking(String userId, String mentorId, String specializationId,
                                    LocalDateTime scheduledTime, Integer durationMinutes, String userMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        Specialization specialization = specializationRepository.findById(specializationId)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found"));

        BigDecimal amount = mentor.getHourlyRate().multiply(new BigDecimal(durationMinutes)).divide(new BigDecimal(60));

        Booking booking = Booking.builder()
                .user(user)
                .mentor(mentor)
                .specialization(specialization)
                .scheduledTime(scheduledTime)
                .durationMinutes(durationMinutes)
                .amount(amount)
                .status(BookingStatus.PENDING)
                .userMessage(userMessage)
                .isFeedbackSubmitted(false)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Booking created: {}", booking.getId());

        return convertToDTO(booking);
    }

    public BookingDTO getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return convertToDTO(booking);
    }

    public List<BookingDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getMentorBookings(String mentorId) {
        return bookingRepository.findByMentorId(mentorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO updateBookingStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.valueOf(status));
        booking = bookingRepository.save(booking);
        log.info("Booking status updated: {} -> {}", bookingId, status);

        return convertToDTO(booking);
    }

    public BookingDTO updateBookingSchedule(String bookingId, LocalDateTime newScheduledTime) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setScheduledTime(newScheduledTime);
        booking = bookingRepository.save(booking);
        log.info("Booking schedule updated: {}", bookingId);

        return convertToDTO(booking);
    }

    public void cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Refund payment if completed
        paymentRepository.findByBookingId(bookingId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setIsRefunded(true);
            payment.setRefundedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        });

        log.info("Booking cancelled: {}", bookingId);
    }

    private BookingDTO convertToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .mentorId(booking.getMentor().getId())
                .specializationId(booking.getSpecialization().getId())
                .scheduledTime(booking.getScheduledTime())
                .durationMinutes(booking.getDurationMinutes())
                .amount(booking.getAmount())
                .status(booking.getStatus().name())
                .userMessage(booking.getUserMessage())
                .isFeedbackSubmitted(booking.getIsFeedbackSubmitted())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
