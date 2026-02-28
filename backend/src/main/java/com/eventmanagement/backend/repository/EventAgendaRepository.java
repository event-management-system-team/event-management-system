package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventAgendaRepository extends JpaRepository<EventAgenda, UUID> {
    List<EventAgenda> findByEvent_EventIdOrderByOrderIndexAsc(UUID eventId);
}
