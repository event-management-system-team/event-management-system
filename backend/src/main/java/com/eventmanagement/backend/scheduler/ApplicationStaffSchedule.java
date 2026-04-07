package com.eventmanagement.backend.scheduler;

import com.eventmanagement.backend.repository.StaffApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationStaffSchedule {
    
    private final StaffApplicationRepository staffApplicationRepository;

    @Scheduled(fixedRate = 300000)
    public void autoRejectExpiredApplications() {
        staffApplicationRepository.autoRejectExpiredApplications();
    }
}