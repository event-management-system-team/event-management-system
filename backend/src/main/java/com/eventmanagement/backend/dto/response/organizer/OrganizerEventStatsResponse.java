package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerEventStatsResponse {

    private long totalEvents;
    private long activeCount;
    private long upcomingCount;
    private long completedCount;
}
