package com.worthmate.controller;

import com.worthmate.dto.PaymentDTO;
import com.worthmate.dto.PaymentIntentResponse;
import com.worthmate.service.PaymentService;
import com.stripe.exception.StripeException;
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
@RequestMapping("/payments")
@Tag(name = "Payments", description = "Payment processing")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Create payment intent", description = "Create Stripe payment intent for a booking")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @RequestParam String bookingId) throws StripeException {
        PaymentIntentResponse response = paymentService.createPaymentIntent(bookingId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get payment status", description = "Get payment status for a specific booking")
    public ResponseEntity<PaymentDTO> getPaymentStatus(@PathVariable String bookingId) {
        PaymentDTO payment = paymentService.getPaymentStatus(bookingId);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/webhook")
    @Operation(summary = "Stripe webhook", description = "Handle Stripe payment webhook events")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestParam String paymentIntentId,
            @RequestParam String status) {
        try {
            paymentService.handleStripeWebhook(paymentIntentId, status);
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception ex) {
            log.error("Webhook processing failed", ex);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook processing failed");
        }
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Refund payment", description = "Refund a completed payment")
    public ResponseEntity<PaymentDTO> refundPayment(
            @PathVariable String paymentId,
            @RequestParam(required = false) String reason) throws StripeException {
        PaymentDTO refund = paymentService.refundPayment(paymentId, reason);
        return ResponseEntity.ok(refund);
    }
}
