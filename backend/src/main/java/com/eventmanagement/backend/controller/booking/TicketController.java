// controller/TicketController.java
package com.eventmanagement.backend.controller.booking;

import com.eventmanagement.backend.dto.response.TicketResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Ticket;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

        private final TicketRepository ticketRepository;

        @GetMapping("/my-tickets")
        @PreAuthorize("hasAnyRole('ATTENDEE')")
        public ResponseEntity<List<TicketResponse>> getMyTickets(
                        @AuthenticationPrincipal User user) {

                List<Ticket> tickets = ticketRepository
                                .findByUserUserId(user.getUserId());

                List<TicketResponse> response = tickets.stream()
                                .map(TicketResponse::from)
                                .collect(Collectors.toList());

                return ResponseEntity.ok(response);
        }

        @GetMapping("/my-tickets/{ticketId}")
        @PreAuthorize("hasAnyRole('ATTENDEE')")
        public ResponseEntity<TicketResponse> getTicketDetail(
                        @PathVariable UUID ticketId,
                        @AuthenticationPrincipal User user) {

                Ticket ticket = ticketRepository.findById(ticketId)
                                .orElseThrow(() -> new NotFoundException(
                                                "The ticket does not exist.: " + ticketId));

                if (!ticket.getUser().getUserId().equals(user.getUserId())) {
                        throw new RuntimeException(
                                        "You are not authorized to view this ticket.");
                }

                return ResponseEntity.ok(TicketResponse.from(ticket));
        }
}