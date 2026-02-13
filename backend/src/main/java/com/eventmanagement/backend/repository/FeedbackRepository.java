package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.dto.response.FeedbackResponse;
import com.eventmanagement.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    @Query("SELECT new com.eventmanagement.backend.dto.response.FeedbackResponse(" +
           "f.id, f.createdAt, " +
           "u.fullName, u.email, u.avatarUrl, " +
           "f.rating, f.comment, " +
           "tt.ticketName) " +
           "FROM Feedback f " +
           "JOIN f.user u " +
           "LEFT JOIN Ticket t ON t.user.id = u.id AND t.event.id = f.event.id " +
           "LEFT JOIN t.ticketType tt " +
           "WHERE f.event.id = :eventId " +
           "ORDER BY f.createdAt DESC")
    List<FeedbackResponse> findAllByEventId(UUID eventId);
}