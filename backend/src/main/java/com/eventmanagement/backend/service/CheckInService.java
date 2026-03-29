package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.TicketStatus;
import com.eventmanagement.backend.dto.request.CheckInRequest;
import com.eventmanagement.backend.dto.response.staff.CheckInResponse;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.CheckIn;
import com.eventmanagement.backend.model.Ticket;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CheckInRepository;
import com.eventmanagement.backend.repository.TicketRepository;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public CheckInResponse processCheckIn(String eventSlug, CheckInRequest request, UUID staffId) {

        Ticket ticket = null;

        if (request.getTicketId() != null) {
            ticket = ticketRepository.findById(request.getTicketId())
                    .orElseThrow(() -> new NotFoundException("Ticket code invalid or does not exist!"));
        } else if (request.getTicketCode() != null && !request.getTicketCode().trim().isEmpty()) {
            ticket = ticketRepository.findByTicketCode(request.getTicketCode())
                    .orElseThrow(() -> new NotFoundException("Ticket code invalid or does not exist!"));
        } else {
            throw new BadRequestException("Please provide Ticket ID or Ticket Code!");
        }

        if (!ticket.getEvent().getEventSlug().equals(eventSlug)) {
            throw new NotFoundException("Ticket code invalid or does not exist!");
        }

        if (ticket.getStatus() == TicketStatus.CHECKED_IN) {
            throw new BadRequestException("The ticket has been used!!");
        }
        // Chấp nhận cả CONFIRMED (vé miễn phí) và PAID (vé có phí)
        if (ticket.getStatus() != TicketStatus.CONFIRMED && ticket.getStatus() != TicketStatus.PAID) {
            throw new NotFoundException("Ticket code invalid or does not exist!");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime allowedStart = ticket.getEvent().getStartDate().minusHours(2);
        LocalDateTime allowedEnd = ticket.getEvent().getEndDate().minusHours(1);

        if (now.isBefore(allowedStart) || now.isAfter(allowedEnd)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");
            throw new BadRequestException("Check-in is only allowed from "
                    + allowedStart.format(formatter) + " to " + allowedEnd.format(formatter));
        }

        User staff = userRepository.getReferenceById(staffId);

        CheckIn checkIn = CheckIn.builder()
                .ticket(ticket)
                .event(ticket.getEvent())
                .staff(staff)
                .build();
        checkIn = checkInRepository.save(checkIn);

        ticket.setStatus(TicketStatus.CHECKED_IN);
        ticketRepository.save(ticket);

        CheckInResponse response = mapToResponse(checkIn, ticket, staff);

        messagingTemplate.convertAndSend("/topic/event/" + eventSlug + "/checkin", response);

        return response;

    }

    public List<CheckInResponse> searchEventTickets(String eventSlug, String keyword) {
        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        List<TicketStatus> statuses = java.util.Arrays.asList(TicketStatus.CONFIRMED, TicketStatus.PAID,
                TicketStatus.CHECKED_IN);
        List<Ticket> tickets = ticketRepository.searchTicketsByKeyword(eventSlug, kw, statuses);

        return tickets.stream().map(ticket -> {

            CheckIn checkIn = ticket.getCheckIn();

            User staff = (checkIn != null) ? checkIn.getStaff() : null;

            return mapToResponse(checkIn, ticket, staff);
        }).collect(Collectors.toList());

    }

    private CheckInResponse mapToResponse(CheckIn checkIn, Ticket ticket, User staff) {
        return CheckInResponse.builder()
                .ticketId(ticket.getTicketId())
                .customerName(ticket.getUser().getFullName())
                .avatarUrl(ticket.getUser().getAvatarUrl())
                .email(ticket.getUser().getEmail())
                // ticketType có thể null với vé miễn phí
                .ticketType(ticket.getTicketType() != null ? ticket.getTicketType().getTicketName() : "Free Ticket")
                .ticketCode(ticket.getTicketCode())
                .scannedBy(staff != null ? staff.getFullName() : null)
                .checkInTime(checkIn != null ? checkIn.getCheckinTime() : null)
                .status(ticket.getStatus().name())
                .createdAt(ticket.getCreatedAt())
                .build();
    }

}
