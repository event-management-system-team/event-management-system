package com.eventmanagement.backend.controller.staff;

import com.eventmanagement.backend.dto.request.CheckInRequest;
import com.eventmanagement.backend.dto.response.staff.CheckInResponse;
import com.eventmanagement.backend.dto.response.staff.WorkspaceResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.CheckInService;
import com.eventmanagement.backend.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff")
@CrossOrigin("*")
public class WorkspaceController {
    private final WorkspaceService workspaceService;
    private final CheckInService checkInService;

    @GetMapping("/{eventSlug}")
    public ResponseEntity<?> getWorkspaceData(@PathVariable("eventSlug") String eventSlug,
                                                              @AuthenticationPrincipal User currentUser) {
        try {
            UUID userId = currentUser.getUserId();
            WorkspaceResponse response = workspaceService.getWorkspaceData(eventSlug, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }

    }

    @PostMapping("/{eventSlug}/check-in")
    public ResponseEntity<?> checkInTicket(
            @PathVariable("eventSlug") String eventSlug,
            @RequestBody CheckInRequest request,
            @AuthenticationPrincipal User currentUser) {
        try {
            UUID staffId = currentUser.getUserId();

            CheckInResponse response = checkInService.processCheckIn(eventSlug, request, staffId);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            CheckInResponse errorResponse = CheckInResponse.builder()
                    .ticketId(request.getTicketId())
                    .status("ERROR")
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{eventSlug}/ticket-list")
    public ResponseEntity<List<CheckInResponse>> searchEventTickets( @PathVariable("eventSlug") String eventSlug,
                                                                     @RequestParam(required = false) String keyword,
                                                                     @AuthenticationPrincipal User currentUser) {
        List<CheckInResponse> response = checkInService.searchEventTickets(eventSlug,keyword);
        return ResponseEntity.ok(response);
    }
}
