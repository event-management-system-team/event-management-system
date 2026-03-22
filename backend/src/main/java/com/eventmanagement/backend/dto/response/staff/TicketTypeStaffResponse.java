package com.eventmanagement.backend.dto.response.staff;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeStaffResponse {
    private UUID ticketTypeId;
    private String ticketName;
    private Integer soldCount;
    private long checkInCount;
}