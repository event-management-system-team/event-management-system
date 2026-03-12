package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {

    @Query("SELECT er FROM EventRegistration er " +
           "JOIN FETCH er.user u " +
           "LEFT JOIN FETCH er.ticketType tt " +
           "WHERE er.event.eventId = :eventId " +
           "ORDER BY er.registrationDate DESC")
    Page<EventRegistration> findByEventIdWithUserAndTicket(@Param("eventId") UUID eventId, Pageable pageable);

    long countByEvent_EventId(UUID eventId);

    long countByEvent_EventIdAndStatus(UUID eventId, String status);
}
