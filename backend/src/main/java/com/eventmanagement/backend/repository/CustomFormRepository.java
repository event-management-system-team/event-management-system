package com.eventmanagement.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.model.CustomForm;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CustomFormRepository extends JpaRepository<CustomForm, UUID> {
    Optional<CustomForm> findByEvent_EventIdAndFormType(UUID eventId, FormType type);

    Optional<CustomForm> findByEvent_EventSlugAndFormTypeAndIsActiveTrue(String eventSlug, FormType formType);

    Optional<CustomForm> findByEvent_EventId(UUID eventId);

    List<CustomForm> findByFormTypeAndIsActive(FormType formType, boolean isActive);

    List<CustomForm> findByEvent_EventIdAndFormTypeAndIsActiveTrue(UUID eventId, FormType formType);

    @Modifying
    @Transactional
    @Query(value = """
                UPDATE custom_forms f 
                SET is_active = false 
                WHERE f.form_type = 'RECRUITMENT' 
                  AND f.is_active = true 
                  AND EXISTS ( 
                      SELECT 1 FROM recruitments r 
                      WHERE r.event_id = f.event_id AND r.deadline < CURRENT_TIMESTAMP
                  )
            """, nativeQuery = true)
    void updateIsActiveRecruitmentFormToFalse();
}
