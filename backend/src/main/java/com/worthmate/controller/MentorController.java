package com.worthmate.controller;

import com.worthmate.dto.MentorDTO;
import com.worthmate.dto.MentorListResponse;
import com.worthmate.dto.MentorEarningsDTO;
import com.worthmate.service.MentorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/mentors")
@Tag(name = "Mentors", description = "Mentor profile and discovery")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @GetMapping
    @Operation(summary = "List all mentors", description = "Get paginated list of verified mentors")
    public ResponseEntity<List<MentorListResponse>> getAllMentors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        List<MentorListResponse> mentors = mentorService.getAllMentors(page, size, category);
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/{mentorId}")
    @Operation(summary = "Get mentor details", description = "Get detailed profile of a specific mentor")
    public ResponseEntity<MentorDTO> getMentorById(@PathVariable String mentorId) {
        MentorDTO mentor = mentorService.getMentorById(mentorId);
        return ResponseEntity.ok(mentor);
    }

    @PutMapping("/{mentorId}")
    @PreAuthorize("hasRole('MENTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update mentor profile", description = "Update mentor's profile information")
    public ResponseEntity<MentorDTO> updateMentorProfile(
            @PathVariable String mentorId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer yearsOfExperience,
            @RequestParam(required = false) BigDecimal hourlyRate,
            @RequestParam(required = false) String certifications) {
        
        MentorDTO updatedMentor = mentorService.updateMentorProfile(mentorId, title, description, 
                yearsOfExperience, hourlyRate, certifications);
        return ResponseEntity.ok(updatedMentor);
    }

    @GetMapping("/{mentorId}/earnings")
    @PreAuthorize("hasRole('MENTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get mentor earnings", description = "Get earnings dashboard for a mentor")
    public ResponseEntity<MentorEarningsDTO> getMentorEarnings(@PathVariable String mentorId) {
        MentorEarningsDTO earnings = mentorService.getMentorEarnings(mentorId);
        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/{mentorId}/availability")
    @Operation(summary = "Get mentor availability", description = "Get available time slots for a mentor")
    public ResponseEntity<String> getMentorAvailability(@PathVariable String mentorId) {
        return ResponseEntity.ok("Availability data for mentor: " + mentorId);
    }

    @GetMapping("/{mentorId}/reviews")
    @Operation(summary = "Get mentor reviews", description = "Get all reviews and ratings for a mentor")
    public ResponseEntity<String> getMentorReviews(@PathVariable String mentorId) {
        return ResponseEntity.ok("Reviews for mentor: " + mentorId);
    }
}
