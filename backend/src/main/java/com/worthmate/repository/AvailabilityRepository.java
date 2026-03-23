package com.worthmate.repository;

import com.worthmate.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, String> {
    List<Availability> findByMentorId(String mentorId);
}
