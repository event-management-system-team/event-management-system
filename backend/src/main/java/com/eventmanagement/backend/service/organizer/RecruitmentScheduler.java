package com.eventmanagement.backend.service.organizer;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j 
public class RecruitmentScheduler {

    private final RecruitmentRepository recruitmentRepository;
    private final CustomFormRepository customFormRepository; 

    // Chạy mỗi phút 1 lần
    @Scheduled(cron = "0 * * * * *") 
    @Transactional
    public void autoUpdateRecruitmentAndFormStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<CustomForm> activeRecruitmentForms = customFormRepository.findByFormTypeAndIsActive(FormType.RECRUITMENT, true);
        for (CustomForm form : activeRecruitmentForms) {
            Event event = form.getEvent();
            List<Recruitment> recruitments = recruitmentRepository.findByEvent_EventId(event.getEventId());
            boolean shouldDeactivateForm = false;
            for (Recruitment r : recruitments) {
                if (now.isAfter(event.getEndDate())) {
                    r.setStatus(RecruitmentStatus.CLOSED);
                    shouldDeactivateForm = true; 
                } 
                else if (now.isBefore(event.getStartDate())) {
                    r.setStatus(RecruitmentStatus.CLOSED);
                } 
                else {
                    if (form.getDeadline() != null && now.isAfter(form.getDeadline())) {
                        r.setStatus(RecruitmentStatus.CLOSED);
                    } else {
                        r.setStatus(RecruitmentStatus.OPEN);
                    }
                }
            }
            if (shouldDeactivateForm) {
                form.setActive(false);
                customFormRepository.save(form);
                log.info("System auto-deactivated form for ended event: {}", event.getEventName());
            }          
            recruitmentRepository.saveAll(recruitments);
        }
    }
}