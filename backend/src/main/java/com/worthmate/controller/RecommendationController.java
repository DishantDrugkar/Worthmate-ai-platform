package com.worthmate.controller;

import com.worthmate.dto.RecommendationDTO;
import com.worthmate.dto.RecommendationResponse;
import com.worthmate.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/recommendations")
@Tag(name = "Recommendations", description = "AI-powered mentor recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get AI recommendations", description = "Get AI-powered mentor recommendations for user")
    public ResponseEntity<String> getRecommendations() {
        return ResponseEntity.ok("Recommendations for user");
    }

    @PostMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Generate recommendation", description = "Generate AI recommendation after feedback submission")
    public ResponseEntity<RecommendationDTO> generateRecommendation(
            @RequestParam String bookingId) {
        RecommendationDTO recommendation = recommendationService.generateRecommendation(bookingId);
        return ResponseEntity.status(HttpStatus.CREATED).body(recommendation);
    }

    @GetMapping("/mentor/{mentorId}/category/{categoryId}")
    @Operation(summary = "Get recommendation score", description = "Get recommendation score for mentor in specific category")
    public ResponseEntity<RecommendationResponse> getRecommendationScore(
            @PathVariable String mentorId,
            @PathVariable String categoryId) {
        RecommendationResponse response = recommendationService.getRecommendationsForMentor(mentorId, categoryId);
        return ResponseEntity.ok(response);
    }
}
