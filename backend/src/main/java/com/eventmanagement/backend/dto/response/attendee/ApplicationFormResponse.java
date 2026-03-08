package com.eventmanagement.backend.dto.response.attendee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationFormResponse {
    private String eventName;
    private String eventSlug;
    private String location;
    private LocalDateTime deadline;
    private List<Map<String, Object>> formSchema;

    private List<PositionResponse> recruitments;

    private String status;
}