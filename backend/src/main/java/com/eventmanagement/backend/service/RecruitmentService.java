package com.eventmanagement.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.request.WorkspaceRequestDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDetailDTO;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitments;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;


@Service
public class RecruitmentService {


    private final RecruitmentRepository recruitmentRepository;
    private final StaffApplicationRepository staffApplicationRepository;
    private final CustomFormService customFormService;
    private final EventRepository eventRepository;

    public RecruitmentService(RecruitmentRepository recruitmentRepository, StaffApplicationRepository staffApplicationRepository, CustomFormService customFormService, EventRepository eventRepository) {
        this.recruitmentRepository = recruitmentRepository;
        this.staffApplicationRepository = staffApplicationRepository;
        this.customFormService = customFormService;
        this.eventRepository = eventRepository;
    }
    
    public RecruitmentDashBoardDTO getDashBoardData(){
        List<Recruitments> allRecruitments = recruitmentRepository.findAll(PageRequest.of(0, 5)).getContent();
        
        int totalActiveRoles =0;
        int totalApplications =0;
        int totalPendingReviews =0;
        int totalHiredStaff =0;

        List<RecruitmentDashBoardDTO.RecruitmentItemDTO> items=new  ArrayList<>();
        for(Recruitments r: allRecruitments){
            int newCount = staffApplicationRepository.countByRecruitmentIdAndStatus(r.getId(), StaffApplication.ApplicationStatus.PENDING);
            int total = staffApplicationRepository.countByRecruitmentId(r.getId());
            if(Recruitments.RecruitmentStatus.OPEN.equals(r.getStatus())){
                totalActiveRoles++; //thong ke tong
            }
        totalApplications+=total; //thong ke tong
        totalPendingReviews+=newCount; //thong ke tong
        int currentHired = (r.getApprovedCount()!=null) ? r.getApprovedCount() : 0;
        int totalVacancy = (r.getVacancy() != null) ? r.getVacancy() : 0;
        totalHiredStaff+=currentHired; //thong ke tong
        String eventName=(r.getEvent()!=null && r.getEvent().getEventName()!=null) ? r.getEvent().getEventName() : "Unknown Event";
        String displayTitle=eventName + " - " + r.getPositionName();
        RecruitmentDashBoardDTO.RecruitmentItemDTO item = RecruitmentDashBoardDTO.RecruitmentItemDTO.builder()
            .recruitmentId(r.getId())
            .title(displayTitle)
            .newCount(newCount)
            .currentCount(currentHired)
            .total(totalVacancy)
            .status(r.getStatus().name())
            .isNew(newCount > 0)
            .build();
        items.add(item);
    }
    RecruitmentDashBoardDTO.StatsDTO stats = RecruitmentDashBoardDTO.StatsDTO.builder()
        .activeRoles(totalActiveRoles)
        .totalApplications(totalApplications)
        .pendingReviews(totalPendingReviews)
        .hiredStaff(totalHiredStaff)
        .build();
    RecruitmentDashBoardDTO dto = RecruitmentDashBoardDTO.builder()
        .stats(stats)
        .recentRecruitments(items)
        .build();
    return dto;
}
public RecruitmentDetailDTO getRecruitmentDetail(UUID recruitmentId) {
        List<Recruitments> recruitment = recruitmentRepository.findAllById(List.of(recruitmentId));
        if (recruitment.isEmpty()) {
            throw new RuntimeException("Không tìm thấy vị trí tuyển dụng này!");
        }
        Recruitments r = recruitment.get(0);
        String eventName = r.getEvent() != null ? r.getEvent().getEventName() : "Sự kiện chung";       
        return RecruitmentDetailDTO.builder()
                .recruitmentId(r.getId())
                .eventName(eventName)
                .positionName(r.getPositionName())
                .description(r.getDescription())
                .benefits(r.getBenefits())
                .vacancy(r.getVacancy())
                .deadline(r.getDeadline())
                .status(r.getStatus().name())
                .build();
    }

    
// lifecycle workspace: tạo mới + cập nhật . Tự động mở và đóng quy trình. nó thuộc AOP (Aspect-Oriented Progamming). nếu có lỗi sẽ roollback luôn

   @Transactional
    public void saveWorkspace(UUID eventId, WorkspaceRequestDTO request) {
        CustomFormRequestDTO formDTO = new CustomFormRequestDTO();
        formDTO.setFormName(request.getFormName());
        formDTO.setDescription(request.getFormDescription());
        formDTO.setFormType("RECRUITMENT");
        formDTO.setFormSchema(request.getFormSchema());
        formDTO.setIsActive(request.getIsFormActive());    
        customFormService.saveCustomForm(eventId, formDTO); 
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event không tồn tại"));
        if (request.getPositions() != null) {
            List<Recruitments> existingPositions = recruitmentRepository.findByEvent_EventId(eventId);
            List<UUID> incomingIds = new ArrayList<>(); 
            for (WorkspaceRequestDTO.PositionDTO posDTO : request.getPositions()) {
                Recruitments recruitment;
                
                if (posDTO.getId() != null) {
                    recruitment = recruitmentRepository.findById(posDTO.getId())
                            .orElse(new Recruitments());
                    
                    if (recruitment.getId() != null) {
                        incomingIds.add(recruitment.getId()); 
                    }
                } else {                   
                    recruitment = new Recruitments();
                }
                recruitment.setEvent(event);
                if (recruitment.getStatus() == null) {
                    recruitment.setStatus(Recruitments.RecruitmentStatus.OPEN);
                }
                
                recruitment.setPositionName(posDTO.getName());
                recruitment.setVacancy(posDTO.getVacancy());        
                
                recruitmentRepository.save(recruitment);
            }
            for (Recruitments oldPos : existingPositions) {
                if (!incomingIds.contains(oldPos.getId())) {
                    recruitmentRepository.delete(oldPos);
                }
            }
        }
    }
}