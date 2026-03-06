package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventResponse {

    private UUID eventId;
    private String eventName;
    private String eventSlug;
    private String description;
    private String location;
    private String bannerUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Boolean isFree;
    private Integer totalCapacity;
    private String categoryName;
    private List<TicketResponse> tickets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketResponse {
        private UUID ticketTypeId;
        private String ticketName;
        private Integer quantity;
        private java.math.BigDecimal price;
    }
}
