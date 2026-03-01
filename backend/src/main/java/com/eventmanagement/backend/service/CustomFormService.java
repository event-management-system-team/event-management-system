package com.eventmanagement.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.repository.CustomFormRepository;

@Service
public class CustomFormService {
    @Autowired
    private CustomFormRepository customFormRepository;
    //DI
    public CustomFormService(CustomFormRepository customFormRepository) {
        this.customFormRepository = customFormRepository;
    }
    public CustomForm saveCustomForm(UUID eventId, CustomFormRequestDTO requestDTO) {
        CustomForm form  = customFormRepository.findByEventIdAndFormType(eventId, requestDTO.getFormType()).orElse(new CustomForm());
        form.setEventId(eventId);
        form.setFormName(requestDTO.getFormName());
        form.setDescription(requestDTO.getDescription());
        form.setFormType(requestDTO.getFormType() != null ? requestDTO.getFormType() : "FEEDBACK");
        form.setFormSchema(requestDTO.getFormSchema());     
        form.setIsActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : true);
        return customFormRepository.save(form);
    }

    public CustomForm getFeedBackForm(UUID eventId) {
        return customFormRepository.findByEventIdAndFormType(eventId, "FEEDBACK").orElse(null);
    }
}
