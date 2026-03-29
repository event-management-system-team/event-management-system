package com.eventmanagement.backend.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class CreateOrderRequest {

    private UUID eventId;

    @Valid
    @NotEmpty(message = "At least one ticket must be selected")
    private List<TicketOrder> tickets;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Data
    @NoArgsConstructor
    public static class TicketOrder {
        private UUID ticketTypeId;

        @Min(1)
        @Max(5)
        private Integer quantity;
    }
}
