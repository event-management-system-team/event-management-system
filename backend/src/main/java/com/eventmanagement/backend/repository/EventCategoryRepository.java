package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, UUID> {

    List<EventCategory> findAllByIsActiveTrue();
}
