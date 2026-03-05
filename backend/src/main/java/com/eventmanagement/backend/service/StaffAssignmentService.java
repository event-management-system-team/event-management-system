package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.AssignmentStatus;
import com.eventmanagement.backend.dto.response.organizer.AssignmentResponse;
import com.eventmanagement.backend.exception.ForbiddenException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.EventStaff;
import com.eventmanagement.backend.model.StaffAssignment;
import com.eventmanagement.backend.model.StaffSchedule;
import com.eventmanagement.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffAssignmentService {
    private final StaffAssignmentRepository staffAssignmentRepository;
    private final StaffScheduleRepository staffScheduleRepository;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;

    @Transactional
    public AssignmentResponse assignStaffToSchedule(UUID scheduleId, UUID staffId) {

        StaffSchedule schedule = staffScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Schedule not found"));

        boolean isStaffOfEvent = staffRepository.existsByEventEventIdAndEventStaffId(schedule.getEvent().getEventId(), staffId);

        if (!isStaffOfEvent) {
            throw new ForbiddenException("User is not staff of this event");
        }

        StaffAssignment assignment = StaffAssignment.builder()
                .schedule(schedule)
                .eventStaff(staffRepository.getReferenceById(staffId))
                .status(AssignmentStatus.ASSIGNED)
                .assignedAt(LocalDateTime.now())
                .build();

        staffAssignmentRepository.save(assignment);

        return AssignmentResponse.builder()
                .assignmentId(assignment.getAssignmentId())
                .staffId(staffId)
                .scheduleId(scheduleId)
                .status(assignment.getStatus().name())
                .assignedAt(assignment.getAssignedAt())
                .build();
    }

    @Transactional
    public void assignMany(UUID scheduleId, List<UUID> staffIds) {

        if (staffIds == null || staffIds.isEmpty()) return;

        StaffSchedule schedule = staffScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Schedule not found"));

        UUID eventId = schedule.getEvent().getEventId();

        List<UUID> uniqueStaffIds = staffIds.stream()
                .distinct()
                .toList();

        List<EventStaff> validStaffs =
                staffRepository.findByEventEventIdAndEventStaffIdIn(eventId, uniqueStaffIds);

        if (validStaffs.isEmpty()) {
            throw new ForbiddenException("No valid staff found for this event");
        }

        List<StaffAssignment> assignments = validStaffs.stream()
                .map(eventStaff -> StaffAssignment.builder()
                        .schedule(schedule)
                        .eventStaff(eventStaff)
                        .status(AssignmentStatus.ASSIGNED)
                        .assignedAt(LocalDateTime.now())
                        .build())
                .toList();

        staffAssignmentRepository.saveAll(assignments);
    }
}
