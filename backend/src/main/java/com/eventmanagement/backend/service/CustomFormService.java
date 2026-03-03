package com.eventmanagement.backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;

@Service
public class CustomFormService {

    // Đã dùng Constructor thì nên thêm chữ 'final' và bỏ @Autowired cho chuẩn Clean Code
    private final CustomFormRepository customFormRepository;
    private final EventRepository eventRepository;

    // DI (Dependency Injection)
    public CustomFormService(CustomFormRepository customFormRepository, EventRepository eventRepository) {
        this.customFormRepository = customFormRepository;
        this.eventRepository = eventRepository;
    }
    

    public CustomForm saveCustomForm(UUID eventId, CustomFormRequestDTO requestDTO) {
        String type = requestDTO.getFormType() != null ? requestDTO.getFormType() : "FEEDBACK";
       
        Optional<CustomForm> existingFormOpt = customFormRepository.findByEventIdAndFormType(eventId, type);
        
        CustomForm form;
        if (existingFormOpt.isPresent()) {
            form = existingFormOpt.get();
            
            if (Boolean.TRUE.equals(form.getIsActive())) {
                throw new IllegalStateException("Form này đã được Publish. Không thể lưu hoặc chỉnh sửa thêm!");
            }
        } else {
            
            form = new CustomForm();
            form.setEventId(eventId);
            form.setFormType(type);
        }
        form.setFormName(requestDTO.getFormName());
        form.setDescription(requestDTO.getDescription());
        form.setFormSchema(requestDTO.getFormSchema());     

        form.setIsActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : false);
        
        return customFormRepository.save(form);
    }

    public CustomForm getFormByType(UUID eventId, String formType) {
        return customFormRepository.findByEventIdAndFormType(eventId, formType).orElse(null);
    }

}