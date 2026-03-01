package com.eventmanagement.backend.repository;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventmanagement.backend.model.CustomForm;

public interface CustomFormRepository extends JpaRepository<CustomForm, UUID> {
java.util.Optional<CustomForm> findByEventIdAndFormType(UUID eventId, String formType);
java.util.Optional<CustomForm> findByEventId(UUID eventId);
}
