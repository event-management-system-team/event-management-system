package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventSummaryResponse {
    private long totalEvents;
    private long activeEvents;
    private long pendingEvents;
    private long completedEvents;
}
