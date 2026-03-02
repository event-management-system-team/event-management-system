package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.StaffApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StaffApplicationRepository extends JpaRepository<StaffApplication, UUID> {

    boolean existsByRecruitment_RecruitmentIdAndUser_UserId(UUID recruitmentId, UUID userId);

    List<StaffApplication> findAllByUser_UserIdOrderByAppliedAtDesc(UUID userId);
}