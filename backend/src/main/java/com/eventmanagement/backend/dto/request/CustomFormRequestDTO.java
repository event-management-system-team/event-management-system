package com.eventmanagement.backend.dto.request;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class CustomFormRequestDTO {
    private String formName;
    private String description;
    private Boolean isActive;
    private String formType; 
    private List<Map<String, Object>> formSchema; 
}
