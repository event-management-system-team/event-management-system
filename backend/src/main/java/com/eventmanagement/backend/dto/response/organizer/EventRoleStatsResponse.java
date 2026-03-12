package com.eventmanagement.backend.dto.response.organizer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventRoleStatsResponse {
    private String role;
    private Long staffCount;
}
