package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventResourceRepository extends JpaRepository<EventResource, UUID> {
    List<EventResource> findByEvent_EventSlugOrderByCreatedAtDesc(String eventSlug);
//    List<EventResource> findByEventEventIdOrderByCreatedAtDesc(UUID eventId);

    List<EventResource> findByEvent_EventIdOrderByCreatedAtDesc(UUID eventId);
}
