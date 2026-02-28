package com.eventmanagement.backend.dto.response.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EventAgendaResponse {
    private UUID agendaId;
    private Integer orderIndex;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
}
