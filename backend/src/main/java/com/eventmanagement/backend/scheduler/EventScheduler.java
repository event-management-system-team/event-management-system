package com.eventmanagement.backend.scheduler;

import com.eventmanagement.backend.service.AdminEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventScheduler {

    private final AdminEventService eventService;

    @Scheduled(cron = "0 0 * * * *")
    public void autoRejectPendingEvents() {
        eventService.autoRejectExpiredPendingEvents();
    }
}
