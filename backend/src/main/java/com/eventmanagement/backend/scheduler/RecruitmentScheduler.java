package com.eventmanagement.backend.scheduler;

import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.service.AdminEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class RecruitmentScheduler {

    private final RecruitmentRepository recruitmentRepository;

    private final CustomFormRepository customFormRepository;

    @Scheduled(fixedRate = 300000)
    public void autoUpdateRecruitmentStatuses() {

        recruitmentRepository.updateStatusToClosed();
        customFormRepository.updateIsActiveRecruitmentFormToFalse();

    }
}