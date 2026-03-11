package com.eventmanagement.backend.service.organizer;

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
import com.eventmanagement.backend.repository.RecruitmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class CustomFormService {

    private final CustomFormRepository customFormRepository;
    private final RecruitmentRepository recruitmentRepository;

    @Transactional 
    public CustomForm saveCustomForm(UUID eventId, CustomFormRequestDTO dto) {
        
        
FormType typeEnum = dto.getFormType() != null ? dto.getFormType() : FormType.FEEDBACK;
        Optional<CustomForm> existingFormOpt = customFormRepository.findByEvent_EventIdAndFormType(eventId, typeEnum);
        
        CustomForm form;
        
        if (existingFormOpt.isPresent()) {
            form = existingFormOpt.get();
            
            if (form.isActive()) {
                form.setDeadline(dto.getDeadline());
                CustomForm savedForm = customFormRepository.save(form);
                
                if (FormType.RECRUITMENT.equals(typeEnum)) {
                    List<Recruitment> recruitments = recruitmentRepository.findByEvent_EventId(eventId);
                    java.time.LocalDateTime now = java.time.LocalDateTime.now();
                    
                    for (Recruitment r : recruitments) {
                        r.setDeadline(savedForm.getDeadline());
                        if (savedForm.getDeadline() != null && savedForm.getDeadline().isAfter(now)) {
                            r.setStatus(RecruitmentStatus.OPEN); 
                        }
                    }
                    recruitmentRepository.saveAll(recruitments);
                }
                
                return savedForm; 
            }
        } else {
            form = new CustomForm();
            Event event = new Event();
            event.setEventId(eventId);
            form.setEvent(event);
            form.setFormType(typeEnum);
        }


        form.setFormName(dto.getFormName());
        form.setFormSchema(dto.getFormSchema()); 
        form.setDeadline(dto.getDeadline());    
        form.setActive(dto.getIsActive() != null ? dto.getIsActive() : false);
        
        CustomForm savedForm = customFormRepository.save(form);

        
        if (FormType.RECRUITMENT.equals(typeEnum)) {
            List<Recruitment> recruitments = recruitmentRepository.findByEvent_EventId(eventId);
            
            for (Recruitment r : recruitments) {
                r.setDeadline(savedForm.getDeadline());
            }
            
            recruitmentRepository.saveAll(recruitments);
        }
        
        return savedForm;
    }

    public CustomForm getFormByType(UUID eventId, FormType formType) {
        return customFormRepository.findByEvent_EventIdAndFormType(eventId, formType).orElse(null);
    }
}

