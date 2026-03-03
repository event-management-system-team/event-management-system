package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.model.StaffApplication;

@Repository
public interface ApplicationRepository extends JpaRepository<StaffApplication, UUID> {
    List<StaffApplication> findByRecruitmentId(UUID recruitmentId);
}
