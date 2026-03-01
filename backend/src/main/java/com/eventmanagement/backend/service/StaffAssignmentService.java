package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.AssignmentStatus;
import com.eventmanagement.backend.dto.response.organizer.AssignmentFlatProjection;
import com.eventmanagement.backend.dto.response.organizer.AssignmentResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffAssignmentResponse;
import com.eventmanagement.backend.exception.ForbiddenException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.StaffAssignment;
import com.eventmanagement.backend.model.StaffSchedule;
import com.eventmanagement.backend.repository.StaffApplicationRepository;
import com.eventmanagement.backend.repository.StaffAssignmentRepository;
import com.eventmanagement.backend.repository.StaffScheduleRepository;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffAssignmentService {
    private final StaffAssignmentRepository staffAssignmentRepository;
    private final StaffScheduleRepository staffScheduleRepository;
    private final StaffApplicationRepository staffApplicationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Map<UUID, Map<LocalDate, List<StaffAssignmentResponse>>>
    getAssignmentsGroupedByStaffAndDate(UUID eventId) {

        List<AssignmentFlatProjection> flats =
                staffAssignmentRepository.findAllAssignmentsByEvent(eventId);

        return flats.stream()
                .map(this::toResponse)
                .collect(Collectors.groupingBy(
                        StaffAssignmentResponse::getStaffId,
                        Collectors.groupingBy(
                                res -> res.getStartTime().toLocalDate(),
                                Collectors.toList()
                        )
                ));
    }

    private StaffAssignmentResponse toResponse(AssignmentFlatProjection flat) {
        return StaffAssignmentResponse.builder()
                .staffId(flat.getStaffId())
                .assignmentId(flat.getAssignmentId())
                .scheduleId(flat.getScheduleId())
                .scheduleName(flat.getScheduleName())
                .startTime(flat.getStartTime())
                .endTime(flat.getEndTime())
                .location(flat.getLocation())
                .status(flat.getStatus())
                .staff(StaffAssignmentResponse.UserDTO.builder()
                        .userId(flat.getUserId())
                        .fullName(flat.getFullName())
                        .email(flat.getEmail())
                        .avatarUrl(flat.getAvatarUrl())
                        .build())
                .build();
    }

    @Transactional
    public AssignmentResponse assignStaffToSchedule(UUID scheduleId, UUID staffId) {

        StaffSchedule schedule = staffScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Schedule not found"));

        // 1️⃣ Check staff có phải staff của event không
        boolean isStaffOfEvent =
                staffApplicationRepository.existsApprovedByUserAndEvent(
                        staffId,
                        schedule.getEvent().getEventId()
                );

        if (!isStaffOfEvent) {
            throw new ForbiddenException("User is not staff of this event");
        }

        // 2️⃣ Check đã assign chưa
        if (staffAssignmentRepository.existsBySchedule_ScheduleIdAndStaff_UserId(scheduleId, staffId)) {
            throw new IllegalStateException("Staff already assigned to this schedule");
        }

        // 3️⃣ Check quá số required_staff
        long assignedCount =
                staffAssignmentRepository.countBySchedule_ScheduleIdAndStatusIn(
                        scheduleId,
                        List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.CONFIRMED)
                );

        if (assignedCount >= schedule.getRequiredStaff()) {
            throw new IllegalStateException("Schedule is full");
        }

        StaffAssignment assignment = StaffAssignment.builder()
                .schedule(schedule)
                .staff(userRepository.getReferenceById(staffId))
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
}
