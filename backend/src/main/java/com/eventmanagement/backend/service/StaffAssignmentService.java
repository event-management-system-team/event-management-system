package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.organizer.AssignmentFlatProjection;
import com.eventmanagement.backend.dto.response.organizer.StaffAssignmentResponse;
import com.eventmanagement.backend.model.StaffAssignment;
import com.eventmanagement.backend.repository.StaffAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffAssignmentService {
    private final StaffAssignmentRepository staffAssignmentRepository;

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
}
