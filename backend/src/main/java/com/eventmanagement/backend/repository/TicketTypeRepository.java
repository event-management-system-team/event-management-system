package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {
    List<TicketType> findByEvent_EventIdAndIsActiveTrue(UUID eventId);
}
