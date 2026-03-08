package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.staff.ResourceResponse;
import com.eventmanagement.backend.dto.response.staff.ScheduleResponse;
import com.eventmanagement.backend.dto.response.staff.WorkspaceResponse;
import com.eventmanagement.backend.exception.ForbiddenException;
import com.eventmanagement.backend.model.*;
import com.eventmanagement.backend.repository.EventResourceRepository;
import com.eventmanagement.backend.repository.EventStaffRepository;
import com.eventmanagement.backend.repository.StaffAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final EventStaffRepository eventStaffRepo;
    private final StaffAssignmentRepository assignmentRepo;
    private final EventResourceRepository resourceRepo;

    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspaceData(String eventSlug, UUID userId) {

        EventStaff eventStaff = eventStaffRepo.findWorkspaceAccess(eventSlug, userId)
                .orElseThrow(() -> new ForbiddenException("You are not an event staff member"));

        User user = eventStaff.getUser();
        Event event = eventStaff.getEvent();

        if (event.getStatus() == EventStatus.COMPLETED && event.getEndDate() != null) {
            LocalDateTime cutoffTime = event.getEndDate().plusDays(5);

            if (LocalDateTime.now().isAfter(cutoffTime)) {
                throw new ForbiddenException("The event ended over 5 days ago. The staff workspace is locked for data security purposes.");
            }
        }

        List<StaffAssignment> assignments = assignmentRepo.findAssignmentsByStaffId(eventStaff.getEventStaffId());

        List<EventResource> resources = resourceRepo.findByEvent_EventSlugOrderByCreatedAtDesc(eventSlug);

        return mapToResponse(assignments, resources, eventStaff, user, event);

    }

    private WorkspaceResponse mapToResponse(List<StaffAssignment> assignments, List<EventResource> resources,
                                            EventStaff eventStaff, User user, Event event) {

        List<ScheduleResponse> scheduleResponses = assignments.stream().map(a -> {
            StaffSchedule schedule = a.getSchedule();

            return ScheduleResponse.builder()
                    .assignmentId(a.getAssignmentId())
                    .scheduleName(schedule.getScheduleName())
                    .location(schedule.getLocation())
                    .startTime(schedule.getStartTime())
                    .endTime(schedule.getEndTime())
                    .status(a.getStatus().name())
                    .build();
        }).collect(Collectors.toList());


        List<ResourceResponse> resourceResponses = resources.stream().map(r ->
                ResourceResponse.builder()
                        .resourceId(r.getResourceId())
                        .resourceName(r.getResourceName())
                        .fileUrl(r.getFileUrl())
                        .fileType(r.getFileType())
                        .resourceType(r.getResourceType())
                        .build()
        ).collect(Collectors.toList());

        WorkspaceResponse.UserInfo userInfo = WorkspaceResponse.UserInfo.builder()
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .build();

        WorkspaceResponse.EventInfo eventInfo = WorkspaceResponse.EventInfo.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .location(event.getLocation())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .bannerUrl(event.getBannerUrl())
                .build();


        return WorkspaceResponse.builder()
                .eventStaffId(eventStaff.getEventStaffId())
                .staffRole(eventStaff.getStaffRole())
                .userInfo(userInfo)
                .eventInfo(eventInfo)
                .schedules(scheduleResponses)
                .resources(resourceResponses)
                .build();
    }
}