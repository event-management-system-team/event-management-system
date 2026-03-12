package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.TicketTypeResponse;
import com.eventmanagement.backend.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class TicketTypeController {
    private final TicketTypeService service;

    @GetMapping("/{slug}/ticket-types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketTypeResponse>> getTicketTypes(@PathVariable String slug) {
        return ResponseEntity.ok(service.getTicketTypes(slug));
    }
}
