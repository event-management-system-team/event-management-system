package com.eventmanagement.backend.service.organizer;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.request.WorkspaceRequestDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDetailDTO;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;


@Service
public class RecruitmentServiceOrganizer {


    private final RecruitmentRepository recruitmentRepository;
    private final StaffApplicationRepository staffApplicationRepository;
    private final CustomFormService customFormService;
    private final EventRepository eventRepository;

    public RecruitmentServiceOrganizer(RecruitmentRepository recruitmentRepository, StaffApplicationRepository staffApplicationRepository, CustomFormService customFormService, EventRepository eventRepository) {
        this.recruitmentRepository = recruitmentRepository;
        this.staffApplicationRepository = staffApplicationRepository;
        this.customFormService = customFormService;
        this.eventRepository = eventRepository;
        
    }
    
    public RecruitmentDashBoardDTO getDashBoardData(){
        List<Recruitment> allRecruitments = recruitmentRepository.findAll(PageRequest.of(0, 5)).getContent();
        
        int totalActiveRoles =0;
        int totalApplications =0;
        int totalPendingReviews =0;
        int totalHiredStaff =0;

        List<RecruitmentDashBoardDTO.RecruitmentItemDTO> items=new  ArrayList<>();
        for(Recruitment r: allRecruitments){
            int newCount = staffApplicationRepository.countByRecruitment_RecruitmentIdAndApplicationStatus(r.getRecruitmentId(), ApplicationStatus.PENDING);
            int total = staffApplicationRepository.countByRecruitment_RecruitmentId(r.getRecruitmentId());
            if(RecruitmentStatus.OPEN.equals(r.getStatus())){
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
            .recruitmentId(r.getRecruitmentId())
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
        List<Recruitment> recruitment = recruitmentRepository.findAllById(List.of(recruitmentId));
        if (recruitment.isEmpty()) {
            throw new RuntimeException("Không tìm thấy vị trí tuyển dụng này!");
        }
        Recruitment r = recruitment.get(0);
        String eventName = r.getEvent() != null ? r.getEvent().getEventName() : "Sự kiện chung";       
        return RecruitmentDetailDTO.builder()
                .recruitmentId(r.getRecruitmentId())
                .eventName(eventName)
                .positionName(r.getPositionName())
                .description(r.getDescription())
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
        formDTO.setFormType(FormType.RECRUITMENT);
        formDTO.setFormSchema(request.getFormSchema());
        formDTO.setIsActive(request.getIsFormActive());    
        customFormService.saveCustomForm(eventId, formDTO); 
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event không tồn tại"));
        if (request.getPositions() != null) {
            List<Recruitment> existingPositions = recruitmentRepository.findByEvent_EventId(eventId);
            List<UUID> incomingIds = new ArrayList<>(); 
            for (WorkspaceRequestDTO.PositionDTO posDTO : request.getPositions()) {
                Recruitment recruitment;
                
                if (posDTO.getId() != null) {
                    recruitment = recruitmentRepository.findById(posDTO.getId())
                            .orElse(new Recruitment());
                    
                    if (recruitment.getRecruitmentId() != null) {
                        incomingIds.add(recruitment.getRecruitmentId()); 
                    }
                } else {                   
                    recruitment = new Recruitment();
                }
                recruitment.setEvent(event);
                if (recruitment.getStatus() == null) {
                    recruitment.setStatus(RecruitmentStatus.OPEN);
                }
                
                recruitment.setPositionName(posDTO.getName());
                recruitment.setVacancy(posDTO.getVacancy());        
                
                recruitmentRepository.save(recruitment);
            }
            for (Recruitment oldPos : existingPositions) {
                if (!incomingIds.contains(oldPos.getRecruitmentId())) {
                    recruitmentRepository.delete(oldPos);
                }
            }
        }
    }
}