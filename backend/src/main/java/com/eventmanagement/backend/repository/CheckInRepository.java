package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {

    int countByEvent_EventId(UUID eventId);
}
