package com.eventmanagement.backend.dto.response.attendee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private UUID eventId;
    private String eventName;
    private String eventSlug;
    private String description;
    private String location;
    private Map<String, Object> locationCoordinates;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String bannerUrl;
    private List<String> imageGallery;
    private String status;
    private Boolean isFree;
    private Integer totalCapacity;
    private Integer registeredCount;
    private Integer checkedInCount;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private EventCategoryResponse category;
    private OrganizerResponse organizer;
    private BigDecimal minPrice;
    private List<EventAgendaResponse> agendas;
    private List<TicketTypeResponse> ticketTypes;

    
}
