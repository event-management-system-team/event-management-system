package com.eventmanagement.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectEventRequest {
    @NotBlank
    private String reason;
}
