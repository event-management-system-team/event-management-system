package com.eventmanagement.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class AssignStaffRequest {

    @NotNull(message = "Staff ID is required")
    private UUID staffId;
}
