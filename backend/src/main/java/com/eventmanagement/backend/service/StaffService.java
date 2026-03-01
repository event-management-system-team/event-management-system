package com.eventmanagement.backend.service;

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
    public List<StaffResponse> getApprovedStaffByEventId(UUID eventId) {
        return staffRepository.findApprovedStaffByEventId(eventId);
    }
}
