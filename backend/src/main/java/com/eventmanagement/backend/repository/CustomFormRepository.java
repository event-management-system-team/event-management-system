package com.eventmanagement.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.model.CustomForm;

@Repository
public interface CustomFormRepository extends JpaRepository<CustomForm, UUID> {
Optional<CustomForm> findByEvent_EventIdAndFormType( UUID eventId, FormType type );    
    Optional<CustomForm> findByEvent_EventSlugAndFormTypeAndIsActiveTrue(String eventSlug, FormType formType);
    Optional<CustomForm> findByEvent_EventId(UUID eventId);
}
