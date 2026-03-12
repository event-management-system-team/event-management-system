package com.eventmanagement.backend.service.organizer;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.RecruitmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j 
public class RecruitmentScheduler {

    private final RecruitmentRepository recruitmentRepository;

    // Chạy tự động mỗi phút 1 lần (để test cho nhanh). 
    @Scheduled(cron = "0 * * * * *") 
    @Transactional
    public void closeExpiredRecruitments() {
        LocalDateTime now = LocalDateTime.now();
        
        List<Recruitment> expiredJobs = recruitmentRepository.findByStatusAndDeadlineBefore(
                RecruitmentStatus.OPEN, now);

        if (!expiredJobs.isEmpty()) {
            for (Recruitment r : expiredJobs) {
                r.setStatus(RecruitmentStatus.CLOSED); 
            }
            
            recruitmentRepository.saveAll(expiredJobs);
            
            log.info("Đã tự động đóng {} tin tuyển dụng quá hạn.", expiredJobs.size());
        }
    }
}