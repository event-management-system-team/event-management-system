package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopPendingEventsResponse {
    private String eventSlug;
    private String eventName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;

    private OrganizerDto organizer;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizerDto {
        private String fullName;
    }
}
