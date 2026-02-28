package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.admin.TicketTypeResponse;
import com.eventmanagement.backend.model.TicketType;
import com.eventmanagement.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeService {
    private final TicketTypeRepository repository;

    public List<TicketTypeResponse> getTicketTypes(UUID eventId) {
        List<TicketType> ticketTypes = repository.findByEvent_EventIdAndIsActiveTrue(eventId);

        LocalDateTime now = LocalDateTime.now();

        return ticketTypes.stream().map(ticket -> {
            int sold = ticket.getSoldCount() != null ? ticket.getSoldCount() : 0;
            int reserved = ticket.getReservedCount() != null ? ticket.getReservedCount() : 0;
            int available = ticket.getQuantity() - sold - reserved;

            String saleStatus;
            if (ticket.getSaleStart() != null && now.isBefore(ticket.getSaleStart())) {
                saleStatus = "NOT_STARTED";
            } else if (ticket.getSaleEnd() != null && now.isAfter(ticket.getSaleEnd())) {
                saleStatus = "ENDED";
            } else if (available <= 0) {
                saleStatus = "SOLD_OUT";
            } else {
                saleStatus = "ON_SALE";
            }

            return TicketTypeResponse.builder()
                    .ticketTypeId(ticket.getTicketTypeId())
                    .ticketName(ticket.getTicketName())
                    .price(ticket.getPrice())
                    .quantity(ticket.getQuantity())
                    .available(available)
                    .description(ticket.getDescription())
                    .saleStatus(saleStatus)
                    .build();
        })
                .toList();
    }
}
