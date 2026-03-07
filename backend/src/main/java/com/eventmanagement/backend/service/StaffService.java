package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.organizer.EventRoleStatsResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;

    public Page<StaffResponse> findStaffByEventId(UUID eventId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StaffResponse> staffPage = staffRepository.findStaffByEventIdPaging(eventId, pageable);

        return staffPage.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> findStaffByEventIdPlain(UUID eventId) {
        return staffRepository.findStaffByEventId(eventId);
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> findStaffByEventIdAndRole(UUID eventId, String role) {
        return staffRepository.findStaffByEventIdAndOptionalRole(eventId, role);
    }

    @Transactional(readOnly = true)
    public List<String> getRolesByEventId(UUID eventId) {
        return staffRepository.findRolesByEventId(eventId);
    }

    @Transactional(readOnly = true)
    public List<EventRoleStatsResponse> getRoleStatsByEventId(UUID eventId) {
        return staffRepository.findRoleStatsByEventId(eventId);
    }

    private StaffResponse mapToResponse(StaffResponse staff) {
        return StaffResponse.builder()
                .staffId(staff.getStaffId())
                .email(staff.getEmail())
                .fullName(staff.getFullName())
                .phone(staff.getPhone())
                .avatarUrl(staff.getAvatarUrl())
                .role(staff.getRole())
                .build();
    }
}
