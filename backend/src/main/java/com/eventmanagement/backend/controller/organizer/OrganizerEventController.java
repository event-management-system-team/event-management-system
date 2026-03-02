package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.OrganizerEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventStatsResponse;
import com.eventmanagement.backend.service.OrganizerEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/organizer/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizerEventController {

    private final OrganizerEventService organizerEventService;

    /**
     * Lấy danh sách event của organizer có phân trang
     */
    @GetMapping
    public ResponseEntity<Page<OrganizerEventResponse>> getMyEvents(
            @RequestParam UUID organizerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<OrganizerEventResponse> events = organizerEventService.getMyEvents(organizerId, page, size);
        return ResponseEntity.ok(events);
    }

    /**
     * Lấy thống kê event của organizer
     */
    @GetMapping("/stats")
    public ResponseEntity<OrganizerEventStatsResponse> getMyEventStats(
            @RequestParam UUID organizerId) {

        OrganizerEventStatsResponse stats = organizerEventService.getMyEventStats(organizerId);
        return ResponseEntity.ok(stats);
    }
}
