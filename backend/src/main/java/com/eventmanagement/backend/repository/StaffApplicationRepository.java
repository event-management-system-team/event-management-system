package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.StaffApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StaffApplicationRepository extends JpaRepository<StaffApplication, UUID> {
    
    boolean existsByRecruitmentIdAndUserId(UUID recruitmentId, UUID userId);
}