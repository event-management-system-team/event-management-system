package com.eventmanagement.backend.scheduler;


import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EventAnalyticsSchedule {

    private final EventRepository eventRepository;
    private final EventAnalyticsRepository eventAnalyticsRepository;
    private final CheckInRepository checkInRepository;
    private final OrderRepository orderRepository;

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void syncEventAnalytics() {

        List<Event> activeEvents = eventRepository.findByStatus(EventStatus.ONGOING);

        for (Event event : activeEvents) {
            UUID eventId = event.getEventId();

            int actualCheckins = checkInRepository.countByEvent_EventId(eventId);
            eventRepository.updateTotalCheckins(eventId, actualCheckins);

            int ticketsAndRegs = event.getRegisteredCount() != null ? event.getRegisteredCount() : 0;
            double revenue = orderRepository.sumRevenueByEventId(eventId);


            eventAnalyticsRepository.upsertDailyAnalytics(
                    eventId,
                    ticketsAndRegs,
                    actualCheckins,
                    ticketsAndRegs,
                    revenue
            );
        }

    }
}
