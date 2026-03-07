package com.eventmanagement.backend.service.organizer;


import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomFormService {

    @Autowired
    private final CustomFormRepository customFormRepository;
    private final EventRepository eventRepository;
    

public CustomForm saveCustomForm(UUID eventId, CustomFormRequestDTO dto) {
        
      String type = dto.getFormType().name() != null ? dto.getFormType().name() : "FEEDBACK";
      FormType typeEnum = FormType.valueOf(type.toUpperCase()); // Biến String thành Enum ở đây!
       
        Optional<CustomForm> existingFormOpt = customFormRepository.findByEvent_EventIdAndFormType(eventId, typeEnum);
        
        CustomForm form;
        if (existingFormOpt.isPresent()) {
            form = existingFormOpt.get();
            
            if (form.isActive()) {
                throw new IllegalStateException("Form này đã được Publish. Không thể lưu hoặc chỉnh sửa thêm!");
            }
        } else {
            
            form = new CustomForm();
            Event event = new Event();

event.setEventId(eventId);

form.setEvent(event);
            form.setFormType(dto.getFormType());
        }
        form.setFormName(dto.getFormName());
        form.setFormSchema(dto.getFormSchema());     

        form.setActive(dto.getIsActive() != null ? dto.getIsActive() : false);
        
        return customFormRepository.save(form);
    }

    public CustomForm getFormByType(UUID eventId, FormType formType) {
        return customFormRepository.findByEvent_EventIdAndFormType(eventId, formType).orElse(null);
    }

}