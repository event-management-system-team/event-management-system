package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Recruitment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.UUID;

@Repository
public interface RecruitmentRepository extends JpaRepository<Recruitment, UUID> {


    @Query("SELECT r FROM Recruitment r " +
            "JOIN FETCH r.event e WHERE r.status = 'OPEN' " +
            "ORDER BY r.createdAt DESC")
    List<Recruitment> findRecentRecruitments(Pageable pageable);
}
