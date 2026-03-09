package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, String> {
    List<TicketType> findByEvent_EventSlugAndIsActiveTrue(String slug);
}
