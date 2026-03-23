package com.worthmate.repository;

import com.worthmate.entity.Call;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CallRepository extends JpaRepository<Call, String> {
    Optional<Call> findByBookingId(String bookingId);
}
