package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    @Query(value = """
                SELECT
                    CAST(f.feedback_id AS VARCHAR) AS feedbackId,
                    f.rating AS rating,
                    f.comment AS comment,
                    u.full_name AS userName,
                    u.email AS userEmail,
                    u.avatar_url AS userAvatar,
                    tt.ticket_name AS ticketName,
                    f.created_at AS createdAt
                FROM feedbacks f
                LEFT JOIN users u ON f.user_id = u.user_id
                LEFT JOIN tickets t ON t.user_id = u.user_id AND t.event_id = f.event_id
                LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id
                WHERE f.event_id = CAST(:eventId AS UUID)
            """, nativeQuery = true)
    List<FeedbackResponseDTO> findFeedbacksByEventId(@Param("eventId") UUID eventId);

    boolean existsByEvent_EventIdAndUser_UserId(UUID eventId, UUID userId);

    // Query 1 — Average Rating
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.event.eventId = :eventId")
    Double findAverageRating(@Param("eventId") UUID eventId);

    // Query 2 — Total Responses
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.event.eventId = :eventId")
    Long countByEventId(@Param("eventId") UUID eventId);

    // Query 3 — Positive Feedback %
    @Query("""
        SELECT COUNT(CASE WHEN f.rating >= 7 THEN 1 END) * 100.0 
        / NULLIF(COUNT(f),0) 
        FROM Feedback f WHERE f.event.eventId = :eventId
    """)
    Double findPositivePercentage(@Param("eventId") UUID eventId);

    // Query 4 — Rating Distribution
    @Query("""
        SELECT f.rating, COUNT(f) 
        FROM Feedback f 
        WHERE f.event.eventId = :eventId 
        GROUP BY f.rating 
        ORDER BY f.rating
    """)
    List<Object[]> findRatingDistribution(@Param("eventId") UUID eventId);

    // Query 5 — Review List (Pagination)
    org.springframework.data.domain.Page<Feedback> findByEvent_EventIdOrderBySubmittedAtDesc(UUID eventId, org.springframework.data.domain.Pageable pageable);
}