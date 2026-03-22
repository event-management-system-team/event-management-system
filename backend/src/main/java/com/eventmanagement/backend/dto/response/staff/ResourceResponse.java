package com.eventmanagement.backend.dto.response.staff;

import com.eventmanagement.backend.constants.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ResourceResponse {
    private UUID resourceId;
    private String resourceName;
    private String fileUrl;
    private String fileType;
    private ResourceType resourceType;
}