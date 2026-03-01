package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.EventAgendaResponse;
import com.eventmanagement.backend.service.EventAgendaService;
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
public class EventAgendaController {

    private final EventAgendaService service;

    @GetMapping("/{id}/agenda")
    public ResponseEntity<List<EventAgendaResponse>> getEventAgenda(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getEventAgenda(id));
    }
}
