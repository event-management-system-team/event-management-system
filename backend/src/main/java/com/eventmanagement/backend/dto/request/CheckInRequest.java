package com.eventmanagement.backend.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class CheckInRequest {
    private UUID ticketId;
}