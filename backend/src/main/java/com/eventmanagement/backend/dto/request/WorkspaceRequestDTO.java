package com.eventmanagement.backend.dto.request;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import lombok.Data;

@Data
public class WorkspaceRequestDTO {
    
    private String formName;
    private String formDescription;
    private List<Map<String, Object>> formSchema;
    private Boolean isFormActive;
    private List<PositionDTO> positions;

    @Data
    public static class PositionDTO {
        private UUID id; 
        private String name;
        private Integer vacancy;
    }
}