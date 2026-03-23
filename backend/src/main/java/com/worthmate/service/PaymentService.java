package com.worthmate.service;

import com.worthmate.dto.PaymentDTO;
import com.worthmate.dto.PaymentIntentResponse;
import com.worthmate.entity.Payment;
import com.worthmate.entity.PaymentStatus;
import com.worthmate.entity.PaymentMethod;
import com.worthmate.entity.Booking;
import com.worthmate.exception.ResourceNotFoundException;
import com.worthmate.repository.PaymentRepository;
import com.worthmate.repository.BookingRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    public PaymentIntentResponse createPaymentIntent(String bookingId) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        long amountInCents = booking.getAmount().multiply(new BigDecimal(100)).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .putMetadata("bookingId", bookingId)
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Payment payment = Payment.builder()
                .booking(booking)
                .user(booking.getUser())
                .amount(booking.getAmount())
                .status(PaymentStatus.PENDING)
                .paymentMethod(PaymentMethod.STRIPE)
                .stripePaymentIntentId(intent.getId())
                .build();

        payment = paymentRepository.save(payment);
        log.info("Payment intent created: {} for booking: {}", intent.getId(), bookingId);

        return PaymentIntentResponse.builder()
                .clientSecret(intent.getClientSecret())
                .paymentIntentId(intent.getId())
                .amount(booking.getAmount())
                .currency("USD")
                .status(intent.getStatus())
                .build();
    }

    public PaymentDTO getPaymentStatus(String bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return convertToDTO(payment);
    }

    public PaymentDTO handleStripeWebhook(String stripePaymentIntentId, String status) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if ("succeeded".equals(status)) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            Booking booking = payment.getBooking();
            booking.setStatus(com.worthmate.entity.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        } else if ("failed".equals(status)) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Stripe payment failed");
        }

        payment = paymentRepository.save(payment);
        log.info("Payment status updated via webhook: {}", stripePaymentIntentId);

        return convertToDTO(payment);
    }

    public PaymentDTO refundPayment(String paymentId, String reason) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStripePaymentIntentId() != null) {
            PaymentIntent intent = PaymentIntent.retrieve(payment.getStripePaymentIntentId());
            intent.refund();
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setIsRefunded(true);
        payment.setRefundedAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        log.info("Payment refunded: {}", paymentId);

        return convertToDTO(payment);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .userId(payment.getUser().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .paymentMethod(payment.getPaymentMethod().name())
                .stripePaymentIntentId(payment.getStripePaymentIntentId())
                .transactionId(payment.getTransactionId())
                .isRefunded(payment.getIsRefunded())
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
