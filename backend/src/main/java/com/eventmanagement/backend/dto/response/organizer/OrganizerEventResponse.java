package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerEventResponse {

    private UUID eventId;
    private String eventName;
    private String eventSlug;
    private String location;
    private String bannerUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;

    private Integer totalCapacity;
    private Integer registeredCount;
    private Integer checkedInCount;

    // Tổng sold và tổng quantity từ tất cả ticket types
    private Integer totalSold;
    private Integer totalTickets;

    private BigDecimal totalRevenue;

    private String categoryName;
    
    private Boolean isFree;
}
