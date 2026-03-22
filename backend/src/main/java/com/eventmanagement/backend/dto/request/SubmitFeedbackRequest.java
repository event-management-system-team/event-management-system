package com.eventmanagement.backend.dto.request;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class SubmitFeedbackRequest {
    private Integer rating;
    private String comment;
    private List<Map<String, Object>> feedbackData; 
}
