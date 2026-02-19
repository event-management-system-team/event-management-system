package com.eventmanagement.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventCategoryResponse {
    private UUID categoryId;
    private String categoryName;
    private String categorySlug;
    private String iconUrl;
    private String colorCode;
    private Boolean isActive;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
