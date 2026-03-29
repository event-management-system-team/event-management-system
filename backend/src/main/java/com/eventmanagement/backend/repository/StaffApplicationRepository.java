package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.model.StaffApplication;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import jakarta.transaction.Transactional;

@Repository
public interface StaffApplicationRepository extends JpaRepository<StaffApplication, UUID> {
    boolean existsByRecruitment_RecruitmentIdAndUser_UserId(UUID recruitmentId, UUID userId);
    List<StaffApplication> findAllByUser_UserIdOrderByAppliedAtDesc(UUID userId);
    int countByRecruitment_RecruitmentIdAndApplicationStatus(UUID recruitmentId, ApplicationStatus status); // so luong ho so theo trang thai
    int countByRecruitment_RecruitmentId(UUID recruitmentId); 
    List<StaffApplication> findByRecruitment_RecruitmentId(UUID recruitmentId);
    List<StaffApplication> findByRecruitment_Event_EventId(UUID eventId);
    Optional<StaffApplication> findByApplicationId(UUID applicationId);

    @Modifying
    @Transactional
    @Query("UPDATE StaffApplication s SET s.applicationStatus = 'REJECTED' WHERE s.user.userId = :userId AND s.recruitment.event.eventId = :eventId AND s.applicationStatus = 'PENDING' AND s.applicationId <> :approvedAppId")
    int rejectOtherApplicationsForEvent(UUID userId, UUID eventId, UUID approvedAppId);

    @Modifying
    @Transactional
    @Query("UPDATE StaffApplication s SET s.applicationStatus = 'REJECTED' WHERE s.applicationStatus = 'PENDING' AND s.recruitment.customForm.isActive = false")
    int autoRejectExpiredApplications();
    
}