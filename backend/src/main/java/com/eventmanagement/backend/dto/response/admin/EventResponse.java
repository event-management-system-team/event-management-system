package com.eventmanagement.backend.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EventResponse {
    private UUID eventId;
    private String eventName;
    private String eventSlug;
    private String description;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String bannerUrl;
    private String status;
    private Boolean isFree;
    private Integer totalCapacity;
    private Integer registeredCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private CategoryDto category;
    private OrganizerDto organizer;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private UUID categoryId;
        private String categoryName;
        private String categorySlug;
        private String iconUrl;
        private String colorCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizerDto {
        private UUID userId;
        private String fullName;
        private String avatarUrl;
    }
}
