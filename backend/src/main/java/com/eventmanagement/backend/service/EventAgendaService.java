package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.admin.EventAgendaResponse;
import com.eventmanagement.backend.model.EventAgenda;
import com.eventmanagement.backend.repository.EventAgendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventAgendaService {

    private final EventAgendaRepository repository;

    public List<EventAgendaResponse> getEventAgenda(UUID eventId) {
        List<EventAgenda> eventAgendas = repository.findByEvent_EventIdOrderByOrderIndexAsc(eventId);

        return eventAgendas.stream().map(agenda -> EventAgendaResponse.builder()
                .agendaId(agenda.getAgendaId())
                .orderIndex(agenda.getOrderIndex())
                .title(agenda.getTitle())
                .description(agenda.getDescription())
                .startTime(agenda.getStartTime())
                .endTime(agenda.getEndTime())
                .location(agenda.getLocation())
                .build())
                .toList();
    }
}
