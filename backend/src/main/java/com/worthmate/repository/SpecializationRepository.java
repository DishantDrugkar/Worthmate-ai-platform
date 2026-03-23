package com.worthmate.repository;

import com.worthmate.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, String> {
    List<Specialization> findByMentorId(String mentorId);
}
