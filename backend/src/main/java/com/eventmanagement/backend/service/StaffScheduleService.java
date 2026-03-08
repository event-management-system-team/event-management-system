package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.request.CreateStaffScheduleRequest;
import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.EventStaff;
import com.eventmanagement.backend.model.StaffSchedule;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.StaffRepository;
import com.eventmanagement.backend.repository.StaffScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffScheduleService {

    private final StaffScheduleRepository staffScheduleRepository;
    private final StaffRepository staffRepository;
    private final EventRepository eventRepository;
    private final StaffAssignmentService staffAssignmentService;

    @Transactional
    public StaffSchedule createSchedule(UUID eventId, CreateStaffScheduleRequest req) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        if (req.getStartTime().isAfter(req.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        StaffSchedule schedule = StaffSchedule.builder()
                .event(event)
                .scheduleName(req.getScheduleName())
                .description(req.getDescription())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .location(req.getLocation())
                .build();

        return staffScheduleRepository.save(schedule);
    }

    public void assignScheduleToRoles(UUID scheduleId, UUID eventId, List<String> roles) {
        if (roles == null || roles.isEmpty()) return;

        List<String> normalizedRoles = roles.stream()
                .map(String::toUpperCase)
                .distinct()
                .toList();

        List<EventStaff> staffs =
                staffRepository.findByEventIdAndRoles(eventId, normalizedRoles);

        if (staffs.isEmpty()) return;

        List<UUID> staffIds = staffs.stream()
                .map(EventStaff::getEventStaffId)
                .toList();

        staffAssignmentService.assignMany(scheduleId, staffIds);
    }

    public StaffScheduleResponse createScheduleAndAssignByRoles(
            UUID eventId,
            CreateStaffScheduleRequest req
    ) {

        StaffSchedule schedule = createSchedule(eventId, req);

        assignScheduleToRoles(
                schedule.getScheduleId(),
                eventId,
                req.getStaffRoles()
        );

        return mapToResponse(schedule);
    }

    private StaffScheduleResponse mapToResponse(@NonNull StaffSchedule schedule) {
        return StaffScheduleResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .scheduleName(schedule.getScheduleName())
                .description(schedule.getDescription())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .location(schedule.getLocation())
                .build();
    }
}
