package com.worthmate.repository;

import com.worthmate.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByBookingId(String bookingId);
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
    List<Payment> findByUserId(String userId);
}
