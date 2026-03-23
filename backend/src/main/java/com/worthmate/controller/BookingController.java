package com.worthmate.controller;

import com.worthmate.dto.BookingDTO;
import com.worthmate.service.BookingService;
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

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "Consultation booking management")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Create booking", description = "Create a new consultation booking")
    public ResponseEntity<BookingDTO> createBooking(
            @RequestParam String mentorId,
            @RequestParam String specializationId,
            @RequestParam LocalDateTime scheduledTime,
            @RequestParam Integer durationMinutes,
            @RequestParam(required = false) String userMessage) {
        
        String userId = userService.getCurrentUser().getId();
        BookingDTO booking = bookingService.createBooking(userId, mentorId, specializationId, 
                scheduledTime, durationMinutes, userMessage);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get user's bookings", description = "Retrieve all bookings for current user")
    public ResponseEntity<List<BookingDTO>> getUserBookings() {
        String userId = userService.getCurrentUser().getId();
        List<BookingDTO> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get booking details", description = "Get details of a specific booking")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable String bookingId) {
        BookingDTO booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update booking", description = "Update or cancel a booking")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable String bookingId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime newScheduledTime) {
        
        BookingDTO booking = bookingService.getBookingById(bookingId);
        
        if (status != null) {
            booking = bookingService.updateBookingStatus(bookingId, status);
        }
        
        if (newScheduledTime != null) {
            booking = bookingService.updateBookingSchedule(bookingId, newScheduledTime);
        }
        
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cancel booking", description = "Cancel a consultation booking")
    public ResponseEntity<String> cancelBooking(@PathVariable String bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    @GetMapping("/mentor/{mentorId}")
    @PreAuthorize("hasRole('MENTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get mentor's bookings", description = "Get all bookings for a mentor")
    public ResponseEntity<List<BookingDTO>> getMentorBookings(@PathVariable String mentorId) {
        List<BookingDTO> bookings = bookingService.getMentorBookings(mentorId);
        return ResponseEntity.ok(bookings);
    }
}
