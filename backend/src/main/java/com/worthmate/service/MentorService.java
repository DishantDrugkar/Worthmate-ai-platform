package com.worthmate.service;

import com.worthmate.dto.MentorDTO;
import com.worthmate.dto.MentorListResponse;
import com.worthmate.dto.MentorEarningsDTO;
import com.worthmate.entity.MentorProfile;
import com.worthmate.entity.MentorStatus;
import com.worthmate.entity.User;
import com.worthmate.exception.ResourceNotFoundException;
import com.worthmate.repository.MentorProfileRepository;
import com.worthmate.repository.UserRepository;
import com.worthmate.repository.BookingRepository;
import com.worthmate.entity.BookingStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MentorService {

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<MentorListResponse> getAllMentors(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page, size);
        
        List<MentorProfile> mentors = mentorProfileRepository.findAllVerifiedMentors();
        
        return mentors.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    public MentorDTO getMentorById(String mentorId) {
        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        return convertToDTO(mentor);
    }

    public MentorDTO getMentorByUserId(String userId) {
        MentorProfile mentor = mentorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found for user"));
        return convertToDTO(mentor);
    }

    public MentorDTO updateMentorProfile(String mentorId, String title, String description,
                                         Integer yearsOfExperience, BigDecimal hourlyRate, String certifications) {
        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        if (title != null) mentor.setTitle(title);
        if (description != null) mentor.setDescription(description);
        if (yearsOfExperience != null) mentor.setYearsOfExperience(yearsOfExperience);
        if (hourlyRate != null) mentor.setHourlyRate(hourlyRate);
        if (certifications != null) mentor.setCertifications(certifications);

        mentor = mentorProfileRepository.save(mentor);
        log.info("Mentor profile updated: {}", mentorId);

        return convertToDTO(mentor);
    }

    public MentorEarningsDTO getMentorEarnings(String mentorId) {
        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        var completedBookings = bookingRepository.findByMentorIdAndStatus(mentorId, BookingStatus.COMPLETED);
        var upcomingBookings = bookingRepository.findByMentorIdAndStatus(mentorId, BookingStatus.CONFIRMED);

        BigDecimal avgEarningsPerCall = completedBookings.isEmpty() ? BigDecimal.ZERO :
                mentor.getTotalEarnings().divide(new BigDecimal(completedBookings.size()), BigDecimal.ROUND_HALF_UP);

        return MentorEarningsDTO.builder()
                .totalEarnings(mentor.getTotalEarnings())
                .totalCalls(mentor.getTotalCalls())
                .averageEarningsPerCall(avgEarningsPerCall)
                .completedCalls(completedBookings.size())
                .upcomingCalls(upcomingBookings.size())
                .build();
    }

    public void updateMentorRating(String mentorId, double rating) {
        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        
        // Update running average
        if (mentor.getTotalReviews() == 0) {
            mentor.setAverageRating(rating);
        } else {
            double newAverage = (mentor.getAverageRating() * mentor.getTotalReviews() + rating) / 
                    (mentor.getTotalReviews() + 1);
            mentor.setAverageRating(newAverage);
        }
        mentor.setTotalReviews(mentor.getTotalReviews() + 1);
        mentorProfileRepository.save(mentor);
    }

    private MentorDTO convertToDTO(MentorProfile mentor) {
        User user = mentor.getUser();
        return MentorDTO.builder()
                .id(mentor.getId())
                .userId(user.getId())
                .title(mentor.getTitle())
                .description(mentor.getDescription())
                .yearsOfExperience(mentor.getYearsOfExperience())
                .hourlyRate(mentor.getHourlyRate())
                .status(mentor.getStatus().name())
                .isAvailable(mentor.getIsAvailable())
                .averageRating(mentor.getAverageRating())
                .totalReviews(mentor.getTotalReviews())
                .totalEarnings(mentor.getTotalEarnings())
                .totalCalls(mentor.getTotalCalls())
                .certifications(mentor.getCertifications())
                .createdAt(mentor.getCreatedAt())
                .updatedAt(mentor.getUpdatedAt())
                .user(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), 
                        user.getLastName(), user.getPhoneNumber(), user.getRole().name(),
                        user.getProfilePicture(), user.getBio(), user.getEmailVerified(),
                        user.getIsActive(), user.getCreatedAt(), user.getUpdatedAt()))
                .build();
    }

    private MentorListResponse convertToListResponse(MentorProfile mentor) {
        return MentorListResponse.builder()
                .id(mentor.getId())
                .firstName(mentor.getUser().getFirstName())
                .lastName(mentor.getUser().getLastName())
                .profilePicture(mentor.getUser().getProfilePicture())
                .title(mentor.getTitle())
                .yearsOfExperience(mentor.getYearsOfExperience())
                .hourlyRate(mentor.getHourlyRate())
                .averageRating(mentor.getAverageRating())
                .totalReviews(mentor.getTotalReviews())
                .isAvailable(mentor.getIsAvailable())
                .build();
    }
}
