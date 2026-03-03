package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface RecruitmentRepository extends JpaRepository<Recruitment, UUID> {


    @Query("SELECT e.eventSlug FROM Recruitment r JOIN r.event e " +
            "WHERE r.status = 'OPEN' " +
            "GROUP BY e.eventSlug " +
            "ORDER BY MAX(r.createdAt) DESC")
    List<String> findRecentEventWithOpenRecruitments(Pageable pageable);


    @Query("SELECT r FROM Recruitment r JOIN FETCH r.event e " +
            "WHERE r.event.eventSlug IN :eventSlugs AND r.status = 'OPEN' " +
            "ORDER BY r.createdAt DESC")
    List<Recruitment> findRecruitmentsByEventSlugs(@Param("eventSlugs") List<String> eventSlugs);


    @Query("SELECT e.eventSlug FROM Recruitment r JOIN r.event e " +
            "WHERE e.status = :status " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "OR LOWER(r.positionName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:location IS NULL OR :location = '' OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))" +
            "AND (CAST(:deadline AS TIMESTAMP ) IS NULL OR r.deadline <= :deadline)" +
            "GROUP BY e.eventSlug, e.createdAt " +
            "ORDER BY e.createdAt DESC")
    Page<String> searchEventSlug(@Param("status") EventStatus status,
                                 @Param("keyword") String keyword,
                                 @Param("location") String location,
                                 @Param("deadline") LocalDateTime deadline,
                                 Pageable pageable);


    @Query("SELECT r FROM Recruitment r JOIN FETCH r.event e " +
            "WHERE r.event.eventSlug IN :eventSlugs AND r.status = :status " +
            "ORDER BY r.createdAt DESC"
    )
    List<Recruitment> searchRecruitments(@Param("status") RecruitmentStatus status,
                                         @Param("eventSlugs") List<String> eventSlugs);

    List<Recruitment> findByEvent_EventSlug(String eventSlug);
}
