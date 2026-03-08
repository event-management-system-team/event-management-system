package com.eventmanagement.backend.service;

import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventStatusJob {

    private final EventRepository eventRepository;
    private final RecruitmentRepository recruitmentRepository;

    @Scheduled(fixedRate = 300000)
    public void autoUpdateEventStatuses() {

        eventRepository.updateStatusToOngoing();
        eventRepository.updateStatusToCompleted();
        recruitmentRepository.updateStatusToClosed();

    }
}