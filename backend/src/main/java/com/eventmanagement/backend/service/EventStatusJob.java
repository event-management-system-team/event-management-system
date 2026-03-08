package com.eventmanagement.backend.service;

import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventStatusJob {

    private final EventRepository eventRepository;

    @Scheduled(fixedRate = 300000)
    public void autoUpdateEventStatuses() {

        int ongoingUpdated = eventRepository.updateStatusToOngoing();
        int completedUpdated = eventRepository.updateStatusToCompleted();

    }
}