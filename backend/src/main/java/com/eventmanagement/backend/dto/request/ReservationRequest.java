package com.eventmanagement.backend.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class ReservationRequest {

    @NonNull()
    private UUID ticketTypeId;

    @Min(1)
    @Max(5)
    private Integer quantity;
}
