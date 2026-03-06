package com.eventmanagement.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.eventmanagement.backend.constants.TicketStatus;
import com.eventmanagement.backend.model.Ticket;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketResponse {

    private UUID ticketId;

    private String ticketCode;

    private String qrCodeUrl;

    private TicketStatus status;

    private BigDecimal price;

    private String eventName;

    private String eventLocation;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime eventStartDate;

    private String ticketTypeName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    public static TicketResponse from(Ticket ticket) {
        return TicketResponse.builder()
                .ticketId(ticket.getTicketId())
                .ticketCode(ticket.getTicketCode())
                .qrCodeUrl(ticket.getQrCodeUrl())
                .status(ticket.getStatus())
                .price(ticket.getPrice())
                .eventName(ticket.getEvent().getEventName())
                .eventLocation(ticket.getEvent().getLocation())
                .eventStartDate(ticket.getEvent().getStartDate())
                .ticketTypeName(ticket.getTicketType().getTicketName())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
