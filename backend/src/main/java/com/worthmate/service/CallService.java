package com.worthmate.service;

import com.worthmate.dto.CallDTO;
import com.worthmate.dto.AgoraTokenResponse;
import com.worthmate.entity.Call;
import com.worthmate.entity.CallStatus;
import com.worthmate.entity.Booking;
import com.worthmate.exception.ResourceNotFoundException;
import com.worthmate.repository.CallRepository;
import com.worthmate.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class CallService {

    @Autowired
    private CallRepository callRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${agora.app-id}")
    private String agoraAppId;

    @Value("${agora.app-certificate}")
    private String agoraAppCertificate;

    public AgoraTokenResponse generateAgoraToken(String bookingId, String userRole) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Call call = callRepository.findByBookingId(bookingId)
                .orElseGet(() -> {
                    Call newCall = Call.builder()
                            .booking(booking)
                            .agoraChannelName("worthmate-" + bookingId)
                            .agoraUserIdMentor(String.valueOf(booking.getMentor().getId().hashCode()))
                            .agoraUserIdUser(String.valueOf(booking.getUser().getId().hashCode()))
                            .status(CallStatus.PENDING)
                            .build();
                    return callRepository.save(newCall);
                });

        // In production, generate actual Agora token using RTC SDK
        String token = generateMockAgoraToken(call.getAgoraChannelName());

        int userId = "MENTOR".equals(userRole) ? 
                call.getAgoraUserIdMentor().hashCode() : 
                call.getAgoraUserIdUser().hashCode();

        return AgoraTokenResponse.builder()
                .token(token)
                .channelName(call.getAgoraChannelName())
                .userId(userId)
                .appId(agoraAppId)
                .build();
    }

    public CallDTO getCallDetails(String bookingId) {
        Call call = callRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Call not found"));
        return convertToDTO(call);
    }

    public CallDTO startCall(String bookingId) {
        Call call = callRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Call not found"));

        call.setStatus(CallStatus.ACTIVE);
        call.setStartTime(LocalDateTime.now());
        call = callRepository.save(call);

        log.info("Call started: {}", bookingId);

        return convertToDTO(call);
    }

    public CallDTO endCall(String bookingId, Integer actualDurationSeconds, String recordingUrl) {
        Call call = callRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Call not found"));

        call.setStatus(CallStatus.COMPLETED);
        call.setEndTime(LocalDateTime.now());
        call.setActualDurationSeconds(actualDurationSeconds);
        call.setRecordingUrl(recordingUrl);
        call.setIsRecorded(recordingUrl != null && !recordingUrl.isEmpty());

        call = callRepository.save(call);

        // Update booking status
        Booking booking = call.getBooking();
        booking.setStatus(com.worthmate.entity.BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        log.info("Call ended: {} - Duration: {} seconds", bookingId, actualDurationSeconds);

        return convertToDTO(call);
    }

    public CallDTO getCallRecording(String bookingId) {
        Call call = callRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Call not found"));

        if (!call.getIsRecorded() || call.getRecordingUrl() == null) {
            throw new ResourceNotFoundException("Recording not found for this call");
        }

        return convertToDTO(call);
    }

    private String generateMockAgoraToken(String channelName) {
        // In production, use Agora RTC SDK to generate actual token
        // This is a placeholder
        return "agora_token_" + UUID.randomUUID().toString();
    }

    private CallDTO convertToDTO(Call call) {
        return CallDTO.builder()
                .id(call.getId())
                .bookingId(call.getBooking().getId())
                .agoraChannelName(call.getAgoraChannelName())
                .agoraUserIdMentor(call.getAgoraUserIdMentor())
                .agoraUserIdUser(call.getAgoraUserIdUser())
                .startTime(call.getStartTime())
                .endTime(call.getEndTime())
                .actualDurationSeconds(call.getActualDurationSeconds())
                .recordingUrl(call.getRecordingUrl())
                .isRecorded(call.getIsRecorded())
                .status(call.getStatus().name())
                .createdAt(call.getCreatedAt())
                .build();
    }
}
