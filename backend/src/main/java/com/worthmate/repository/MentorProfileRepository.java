package com.worthmate.repository;

import com.worthmate.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, String> {
    Optional<MentorProfile> findByUserId(String userId);
    
    @Query("SELECT m FROM MentorProfile m WHERE m.status = 'VERIFIED' AND m.isAvailable = true")
    List<MentorProfile> findAllVerifiedAvailableMentors();
    
    @Query("SELECT m FROM MentorProfile m WHERE m.status = 'VERIFIED'")
    List<MentorProfile> findAllVerifiedMentors();
}
