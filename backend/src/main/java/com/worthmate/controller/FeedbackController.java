package com.worthmate.controller;

import com.worthmate.dto.FeedbackDTO;
import com.worthmate.service.FeedbackService;
import com.worthmate.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/feedback")
@Tag(name = "Feedback", description = "Feedback and ratings management")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Submit feedback", description = "Submit feedback and rating for a completed call")
    public ResponseEntity<FeedbackDTO> submitFeedback(
            @RequestParam String bookingId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            @RequestParam(defaultValue = "false") Boolean wouldRecommend,
            @RequestParam(defaultValue = "false") Boolean wasHelpful,
            @RequestParam(required = false) String keyTakeaways) {
        
        FeedbackDTO feedback = feedbackService.submitFeedback(bookingId, rating, comment,
                wouldRecommend, wasHelpful, keyTakeaways);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
    }

    @GetMapping("/{bookingId}")
    @Operation(summary = "Get feedback", description = "Get feedback for a specific booking")
    public ResponseEntity<FeedbackDTO> getFeedbackByBookingId(@PathVariable String bookingId) {
        FeedbackDTO feedback = feedbackService.getFeedbackByBookingId(bookingId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/mentor/{mentorId}")
    @Operation(summary = "Get mentor feedbacks", description = "Get all feedbacks for a specific mentor")
    public ResponseEntity<List<FeedbackDTO>> getMentorFeedbacks(@PathVariable String mentorId) {
        List<FeedbackDTO> feedbacks = feedbackService.getMentorFeedbacks(mentorId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get user feedbacks", description = "Get all feedbacks submitted by a user")
    public ResponseEntity<List<FeedbackDTO>> getUserFeedbacks(@PathVariable String userId) {
        List<FeedbackDTO> feedbacks = feedbackService.getUserFeedbacks(userId);
        return ResponseEntity.ok(feedbacks);
    }
}
