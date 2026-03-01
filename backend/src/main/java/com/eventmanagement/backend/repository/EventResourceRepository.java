package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventResourceRepository extends JpaRepository<EventResource, UUID> {
    List<EventResource> findByEvent_EventId(UUID eventId);
}
