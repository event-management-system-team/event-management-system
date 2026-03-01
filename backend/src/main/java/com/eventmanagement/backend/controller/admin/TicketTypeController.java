package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.TicketTypeResponse;
import com.eventmanagement.backend.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class TicketTypeController {
    private final TicketTypeService service;

    @GetMapping("/{id}/ticket-types")
    public ResponseEntity<List<TicketTypeResponse>> getTicketTypes(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getTicketTypes(id));
    }
}
