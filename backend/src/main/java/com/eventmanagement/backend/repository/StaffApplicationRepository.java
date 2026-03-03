package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventmanagement.backend.model.StaffApplication;
public interface StaffApplicationRepository extends JpaRepository<StaffApplication, UUID> {
    int countByRecruitmentIdAndStatus(UUID recruitmentId, StaffApplication.ApplicationStatus status); // so luong ho so theo trang thai
    int countByRecruitmentId(UUID recruitmentId); // so luong ho so
    List<StaffApplication> findByRecruitment_Id(UUID recruitmentId);
}
