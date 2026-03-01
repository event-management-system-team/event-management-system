package com.eventmanagement.backend.dto.response.attendee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionResponse {
    private UUID recruitmentId;
    private String positionName;
    private int vacancy;
    private int availableSlots;
    private String requirements;
}
