package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.request.CreateStaffScheduleRequest;
import com.eventmanagement.backend.dto.response.organizer.ScheduleResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.StaffSchedule;
import com.eventmanagement.backend.repository.EventRepository;
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
    private final EventRepository eventRepository;
    private final StaffAssignmentService staffAssignmentService;

    @Transactional(readOnly = true)
    public List<StaffScheduleResponse> getSchedulesByEvent(UUID eventId) {
        return staffScheduleRepository.findSchedulesByEventId(eventId);
    }

    @Transactional
    public ScheduleResponse createSchedule(UUID eventId, CreateStaffScheduleRequest req) {

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
                .requiredStaff(req.getRequiredStaff())
                .build();

        StaffSchedule savedSchedule = staffScheduleRepository.save(schedule);

        return mapToResponse(savedSchedule);
    }

    public ScheduleResponse createScheduleAndAssign(UUID eventId, CreateStaffScheduleRequest req) {

        StaffSchedule schedule = staffScheduleRepository.save(
            StaffSchedule.builder()
                    .event(eventRepository.getReferenceById(eventId))
                    .scheduleName(req.getScheduleName())
                    .startTime(req.getStartTime())
                    .endTime(req.getEndTime())
                    .description(req.getDescription())
                    .location(req.getLocation())
                    .requiredStaff(req.getRequiredStaff())
                    .build()
        );

        if (req.getStaffIds() != null && !req.getStaffIds().isEmpty()) {
            staffAssignmentService.assignMany(schedule.getScheduleId(), req.getStaffIds());
        }

        return mapToResponse(schedule);
    }

    private ScheduleResponse mapToResponse(@NonNull StaffSchedule schedule) {
        return ScheduleResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .scheduleName(schedule.getScheduleName())
                .description(schedule.getDescription())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .location(schedule.getLocation())
                .requiredStaff(schedule.getRequiredStaff())
                .build();
    }
}
