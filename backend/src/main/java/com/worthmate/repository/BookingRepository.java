package com.worthmate.repository;

import com.worthmate.entity.Booking;
import com.worthmate.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByMentorId(String mentorId);
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);
    List<Booking> findByMentorIdAndStatus(String mentorId, BookingStatus status);
    List<Booking> findByStatus(BookingStatus status);
}
