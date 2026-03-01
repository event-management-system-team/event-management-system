package com.eventmanagement.backend.repository;


import java.util.List;
import java.util.UUID; 

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.dto.response.FeedbackResponseDTO;
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
        JOIN users u ON f.user_id = u.user_id
        JOIN tickets t ON t.user_id = u.user_id AND t.event_id = f.event_id
        JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id
        WHERE f.event_id = CAST(:eventId AS UUID)
    """, nativeQuery = true)
    List<FeedbackResponseDTO> findFeedbacksByEventId(@Param("eventId") UUID eventId);

}