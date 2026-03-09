package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventAgendaRepository extends JpaRepository<EventAgenda, String> {
    List<EventAgenda> findByEvent_EventSlugOrderByOrderIndexAsc(String slug);
}
