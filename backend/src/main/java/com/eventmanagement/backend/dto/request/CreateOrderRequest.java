package com.eventmanagement.backend.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NonNull;

@Data
public class CreateOrderRequest {

    @NonNull
    private UUID ticketTypeId;

    @Min(1)
    @Max(5)
    private Integer quantity;

    private String fullName;
    private String email;
}
