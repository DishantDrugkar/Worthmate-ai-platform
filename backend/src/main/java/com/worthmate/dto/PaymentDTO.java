package com.worthmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private String id;
    private String bookingId;
    private String userId;
    private BigDecimal amount;
    private String status;
    private String paymentMethod;
    private String stripePaymentIntentId;
    private String transactionId;
    private Boolean isRefunded;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}

@Data
class CreatePaymentRequest {
    private String bookingId;
    private String paymentMethod; // STRIPE, RAZORPAY, etc.
}

@Data
class PaymentIntentResponse {
    private String clientSecret;
    private String paymentIntentId;
    private BigDecimal amount;
    private String currency;
    private String status;
}

@Data
class PaymentStatusResponse {
    private String paymentId;
    private String bookingId;
    private String status;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private String failureReason;
}

@Data
class RefundRequest {
    private String paymentId;
    private String reason;
}
