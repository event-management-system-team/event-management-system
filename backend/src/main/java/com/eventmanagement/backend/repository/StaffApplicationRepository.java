package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.model.StaffApplication;

@Repository
public interface StaffApplicationRepository extends JpaRepository<StaffApplication, UUID> {
    boolean existsByRecruitment_RecruitmentIdAndUser_UserId(UUID recruitmentId, UUID userId);
    List<StaffApplication> findAllByUser_UserIdOrderByAppliedAtDesc(UUID userId);
    int countByRecruitment_RecruitmentIdAndApplicationStatus(UUID recruitmentId, ApplicationStatus status); // so luong ho so theo trang thai
    int countByRecruitment_RecruitmentId(UUID recruitmentId); 
    List<StaffApplication> findByRecruitment_RecruitmentId(UUID recruitmentId);
    Optional<StaffApplication> findByApplicationId(UUID applicationId);

    
}