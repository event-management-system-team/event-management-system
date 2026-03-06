package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.organizer.EventRoleStatsResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;

    @Transactional(readOnly = true)
    public List<StaffResponse> findStaffByEventId(UUID eventId) {
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
}
