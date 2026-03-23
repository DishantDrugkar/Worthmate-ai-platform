package com.worthmate.controller;

import com.worthmate.dto.CallDTO;
import com.worthmate.dto.AgoraTokenResponse;
import com.worthmate.service.CallService;
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
@RequestMapping("/calls")
@Tag(name = "Video Calls", description = "Agora video call management")
public class CallController {

    @Autowired
    private CallService callService;

    @PostMapping("/generate-token")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Generate Agora RTC token", description = "Generate token for joining Agora video call")
    public ResponseEntity<AgoraTokenResponse> generateAgoraToken(
            @RequestParam String bookingId,
            @RequestParam String userRole) {
        AgoraTokenResponse response = callService.generateAgoraToken(bookingId, userRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get call details", description = "Get details of a specific video call")
    public ResponseEntity<CallDTO> getCallDetails(@PathVariable String bookingId) {
        CallDTO call = callService.getCallDetails(bookingId);
        return ResponseEntity.ok(call);
    }

    @PostMapping("/{bookingId}/start")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Start call", description = "Mark call as active/started")
    public ResponseEntity<CallDTO> startCall(@PathVariable String bookingId) {
        CallDTO call = callService.startCall(bookingId);
        return ResponseEntity.ok(call);
    }

    @PostMapping("/{bookingId}/end")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "End call", description = "Mark call as completed and save duration")
    public ResponseEntity<CallDTO> endCall(
            @PathVariable String bookingId,
            @RequestParam Integer actualDurationSeconds,
            @RequestParam(required = false) String recordingUrl) {
        CallDTO call = callService.endCall(bookingId, actualDurationSeconds, recordingUrl);
        return ResponseEntity.ok(call);
    }

    @GetMapping("/{bookingId}/recording")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get call recording", description = "Get recording URL for a completed call")
    public ResponseEntity<CallDTO> getCallRecording(@PathVariable String bookingId) {
        CallDTO call = callService.getCallRecording(bookingId);
        return ResponseEntity.ok(call);
    }
}
