package com.eventmanagement.backend.dto.request;

import com.eventmanagement.backend.constants.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateResourceRequest {
    @NotBlank(message = "Resource name is required")
    @Size(max = 255, message = "Resource name must not exceed 255 characters")
    private String resourceName;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Resource type is required")
    private ResourceType resourceType;
}
