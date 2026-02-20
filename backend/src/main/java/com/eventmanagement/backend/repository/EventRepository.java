package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findTop6ByStatusOrderByRegisteredCountDesc(EventStatus status);

}
