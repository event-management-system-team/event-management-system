package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.model.EventAgenda;

@Repository
public interface EventAgendaRepository extends JpaRepository<EventAgenda, UUID> {
    List<EventAgenda> findByEvent_EventSlugOrderByOrderIndexAsc(String slug);
}
