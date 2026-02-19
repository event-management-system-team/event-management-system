package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.EventCategoryResponse;
import com.eventmanagement.backend.model.EventCategory;
import com.eventmanagement.backend.repository.EventCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventCategoryService {
    private final EventCategoryRepository eventCategoryRepository;

    public List<EventCategoryResponse> getAllCategories() {
        List<EventCategory> eventCategories = eventCategoryRepository.findAllByIsActiveTrue();


        return eventCategories.stream()
                .map((category) -> mapToResponse(category))
                .collect(Collectors.toList());
    }

    private EventCategoryResponse mapToResponse(EventCategory eventCategory) {
        return EventCategoryResponse.builder()
                .categoryId(eventCategory.getCategoryId())
                .categoryName(eventCategory.getCategoryName())
                .categorySlug(eventCategory.getCategorySlug())
                .iconUrl(eventCategory.getIconUrl())
                .colorCode(eventCategory.getColorCode())
                .isActive(eventCategory.getIsActive())
                .displayOrder(eventCategory.getDisplayOrder())
                .createdAt(eventCategory.getCreatedAt())
                .updatedAt(eventCategory.getUpdatedAt())
                .build();
    }
}
