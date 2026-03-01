package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.repository.StaffScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffScheduleService {

    private final StaffScheduleRepository staffScheduleRepository;

    @Transactional(readOnly = true)
    public List<StaffScheduleResponse> getSchedulesByEvent(UUID eventId) {
        return staffScheduleRepository.findSchedulesByEventId(eventId);
    }
}
