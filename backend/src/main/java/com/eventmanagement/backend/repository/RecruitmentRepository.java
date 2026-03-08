package com.eventmanagement.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.model.Recruitment;

@Repository
public interface RecruitmentRepository extends JpaRepository<Recruitment, UUID> {

    List<Recruitment> findByEvent_EventId(UUID eventId);


    @Query("SELECT e.eventSlug FROM Recruitment r JOIN r.event e " +
            "WHERE r.status IN :statuses " +
            "GROUP BY e.eventSlug " +
            "ORDER BY MAX(r.createdAt) DESC")
    List<String> findRecentEventWithOpenRecruitments(@Param("statuses") List<RecruitmentStatus> statuses,
                                                     Pageable pageable);


    @Query("SELECT r FROM Recruitment r JOIN FETCH r.event e " +
            "WHERE r.event.eventSlug IN :eventSlugs AND r.status IN :statuses " +
            "ORDER BY r.status DESC, r.createdAt DESC")
    List<Recruitment> findRecruitmentsByEventSlugs(@Param("eventSlugs") List<String> eventSlugs,
                                                   @Param("statuses") List<RecruitmentStatus> statuses);


    @Query("SELECT e.eventSlug FROM Recruitment r JOIN r.event e " +
            "WHERE e.status IN :statuses " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "OR LOWER(r.positionName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:location IS NULL OR :location = '' OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))" +
            "AND (CAST(:deadline AS TIMESTAMP ) IS NULL OR r.deadline <= :deadline)" +
            "GROUP BY e.eventSlug, e.createdAt " +
            "ORDER BY e.createdAt DESC")
    Page<String> searchEventSlug(@Param("statuses") List<EventStatus> statuses,
                                 @Param("keyword") String keyword,
                                 @Param("location") String location,
                                 @Param("deadline") LocalDateTime deadline,
                                 Pageable pageable);


    @Query("SELECT r FROM Recruitment r JOIN FETCH r.event e " +
            "WHERE r.event.eventSlug IN :eventSlugs AND r.status IN :statuses " +
            "ORDER BY r.createdAt DESC"
    )
    List<Recruitment> searchRecruitments(@Param("statuses") List<RecruitmentStatus> statuses,
                                         @Param("eventSlugs") List<String> eventSlugs);

    List<Recruitment> findByEvent_EventSlug(String eventSlug);


    @Modifying
    @Transactional
    @Query("UPDATE Recruitment r SET r.status = 'CLOSED' WHERE r.status = 'OPEN' " +
            "AND r.deadline <= CURRENT_TIMESTAMP")
    int updateStatusToClosed();
}
