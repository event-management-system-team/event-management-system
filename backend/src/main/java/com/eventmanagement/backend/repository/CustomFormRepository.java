package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.model.CustomForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomFormRepository extends JpaRepository<CustomForm, UUID> {


    Optional<CustomForm> findByEvent_EventSlugAndFormTypeAndIsActiveTrue(String eventSlug, FormType formType);

}
