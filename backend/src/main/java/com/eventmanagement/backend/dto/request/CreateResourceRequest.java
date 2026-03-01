package com.eventmanagement.backend.dto.request;

import com.eventmanagement.backend.constants.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateResourceRequest {
    @NotBlank(message = "Resource name is required")
    @Size(max = 255, message = "Resource name must not exceed 255 characters")
    private String resourceName;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    @Size(max = 50, message = "File type must not exceed 50 characters")
    private String fileType;

    @Positive(message = "File size must be greater than 0")
    private Integer fileSize;

    @NotNull(message = "Resource type is required")
    private ResourceType resourceType;
}
