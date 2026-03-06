package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.TicketStatus;
import com.eventmanagement.backend.dto.response.staff.CheckInResponse;
import com.eventmanagement.backend.model.CheckIn;
import com.eventmanagement.backend.model.Ticket;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CheckInRepository;
import com.eventmanagement.backend.repository.TicketRepository;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Transactional
    public CheckInResponse processCheckIn(String eventSlug, UUID ticketId, UUID staffId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Not found ticket in system"));

        if (!ticket.getEvent().getEventSlug().equals(eventSlug)) {
            throw new RuntimeException("Not found ticket in system");
        }

        if (ticket.getStatus() == TicketStatus.CHECKED_IN) {
            throw new RuntimeException("The ticket has been used!!");
        }
        if (ticket.getStatus() != TicketStatus.PAID) {
            throw new RuntimeException("Invalid ticket");
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

    return mapToResponse(checkIn,ticket, staff);

    }

    public List<CheckInResponse> searchEventTickets(String eventSlug, String keyword) {
        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        List<Ticket> tickets = ticketRepository.searchTicketsByKeyword(eventSlug, kw);

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
                .ticketType(ticket.getTicketType().getTicketName())
                .ticketCode(ticket.getTicketCode())
                .scannedBy(staff != null ? staff.getFullName() : null)
                .checkInTime(checkIn != null ? checkIn.getCheckinTime() : null)
                .status(ticket.getStatus().name())
                .createdAt(ticket.getCreatedAt())
                .build();
    }

}
