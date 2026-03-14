package com.eventmanagement.backend.service.organizer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class CustomFormService {

    private final CustomFormRepository customFormRepository;
    private final RecruitmentRepository recruitmentRepository;
    private final EventRepository eventRepository;

    @Transactional 
    public CustomForm saveCustomForm(UUID eventId, CustomFormRequestDTO dto) {
        FormType typeEnum = dto.getFormType() != null ? dto.getFormType() : FormType.FEEDBACK;
        Optional<CustomForm> existingFormOpt = customFormRepository.findByEvent_EventIdAndFormType(eventId, typeEnum);
        
        CustomForm form;
        LocalDateTime now = LocalDateTime.now();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (existingFormOpt.isPresent()) {
            form = existingFormOpt.get();
        } else {
            form = new CustomForm();
            form.setEvent(event);
            form.setFormType(typeEnum);
        }

        form.setFormName(dto.getFormName());
        form.setFormSchema(dto.getFormSchema()); 
        form.setDeadline(dto.getDeadline());    
        
        boolean requestedActive = dto.getIsActive() != null ? dto.getIsActive() : false;
        
        if (FormType.RECRUITMENT.equals(typeEnum) && requestedActive) {
            if (now.isAfter(event.getEndDate())) {
                form.setActive(false);
            } else {
                form.setActive(requestedActive);
            }
        } else {
            form.setActive(requestedActive);
        }

        CustomForm savedForm = customFormRepository.save(form);
        updateRecruitmentData(event, savedForm);
        return savedForm;
    }

    public CustomForm getFormByType(UUID eventId, FormType formType) {
        return customFormRepository.findByEvent_EventIdAndFormType(eventId, formType).orElse(null);
    }

    private void updateRecruitmentData(Event event, CustomForm savedForm) {
        if (FormType.RECRUITMENT.equals(savedForm.getFormType())) {
            List<Recruitment> recruitments = recruitmentRepository.findByEvent_EventId(event.getEventId());
            LocalDateTime now = LocalDateTime.now();
            
            for (Recruitment r : recruitments) {
                r.setDeadline(savedForm.getDeadline());
                if (savedForm.isActive()) {
                    if (now.isBefore(event.getStartDate())) {
                        r.setStatus(RecruitmentStatus.CLOSED);
                    } 
                    else if (now.isAfter(event.getEndDate())) {
                        r.setStatus(RecruitmentStatus.CLOSED);
                    }
                    else {
                        if (savedForm.getDeadline() == null || savedForm.getDeadline().isAfter(now)) {
                            r.setStatus(RecruitmentStatus.OPEN); 
                        } else {
                            r.setStatus(RecruitmentStatus.CLOSED);
                        }
                    }
                } else {
                    r.setStatus(RecruitmentStatus.CLOSED);
                }
            }
            recruitmentRepository.saveAll(recruitments);
        }
    }
}