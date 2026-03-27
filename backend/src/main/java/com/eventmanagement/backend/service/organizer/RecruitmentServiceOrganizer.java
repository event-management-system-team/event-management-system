package com.eventmanagement.backend.service.organizer;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.dto.request.CreateRecruitmentRequest;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.request.UpdateRecruitmentRequest;
import com.eventmanagement.backend.dto.request.WorkspaceRequestDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDetailDTO;
import com.eventmanagement.backend.model.BenefitRecruitment;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruitmentServiceOrganizer {

    private final RecruitmentRepository recruitmentRepository;
    private final StaffApplicationRepository staffApplicationRepository;
    private final CustomFormService customFormService;
    private final CustomFormRepository customFormRepository;
    private final EventRepository eventRepository;

    public RecruitmentDashBoardDTO getDashBoardData(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Recruitment> allRecruitments = recruitmentRepository.findByEvent_EventId(eventId);

        int totalActiveRoles = 0;
        int totalApplications = 0;
        int totalPendingReviews = 0;
        int totalHiredStaff = 0;

        List<RecruitmentDashBoardDTO.RecruitmentItemDTO> items = new ArrayList<>();

        for (Recruitment r : allRecruitments) {
            int newCount = staffApplicationRepository.countByRecruitment_RecruitmentIdAndApplicationStatus(
                    r.getRecruitmentId(), ApplicationStatus.PENDING);
            int total = staffApplicationRepository.countByRecruitment_RecruitmentId(r.getRecruitmentId());
            int currentHired = staffApplicationRepository.countByRecruitment_RecruitmentIdAndApplicationStatus(
                    r.getRecruitmentId(), ApplicationStatus.APPROVED);

            if (RecruitmentStatus.OPEN.equals(r.getStatus())) {
                totalActiveRoles++;
            }

            totalApplications += total;
            totalPendingReviews += newCount;
            totalHiredStaff += currentHired;

            int totalVacancy = (r.getVacancy() != null) ? r.getVacancy() : 0;
            String eventName = (r.getEvent() != null && r.getEvent().getEventName() != null)
                    ? r.getEvent().getEventName()
                    : "Unknown Event";
            String displayTitle = eventName + " - " + r.getPositionName();

            RecruitmentDashBoardDTO.RecruitmentItemDTO item = RecruitmentDashBoardDTO.RecruitmentItemDTO.builder()
                    .recruitmentId(r.getRecruitmentId())
                    .title(displayTitle)
                    .newCount(newCount)
                    .currentCount(currentHired)
                    .total(totalVacancy)
                    .status(r.getStatus().name())
                    .isNew(newCount > 0)
                    .deadline(r.getDeadline())
                    .build();

            items.add(item);
        }

        RecruitmentDashBoardDTO.StatsDTO stats = RecruitmentDashBoardDTO.StatsDTO.builder()
                .activeRoles(totalActiveRoles)
                .totalApplications(totalApplications)
                .pendingReviews(totalPendingReviews)
                .hiredStaff(totalHiredStaff)
                .build();

        return RecruitmentDashBoardDTO.builder()
                .stats(stats)
                .recentRecruitments(items)
                .eventEndDate(event.getEndDate())
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // DETAIL
    // ─────────────────────────────────────────────────────────────────

    public RecruitmentDetailDTO getRecruitmentDetail(UUID recruitmentId) {
        Recruitment r = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vị trí tuyển dụng này!"));

        String eventName = r.getEvent() != null ? r.getEvent().getEventName() : "Sự kiện chung";

        String benefitsStr = null;
        if (r.getBenefits() != null && !r.getBenefits().isEmpty()) {
            benefitsStr = r.getBenefits().stream()
                    .map(BenefitRecruitment::getTitle)
                    .collect(java.util.stream.Collectors.joining("\n"));
        }

        return RecruitmentDetailDTO.builder()
                .recruitmentId(r.getRecruitmentId())
                .eventId(r.getEvent() != null ? r.getEvent().getEventId() : null)
                .eventName(eventName)
                .positionName(r.getPositionName())
                .description(r.getDescription())
                .vacancy(r.getVacancy())
                .deadline(r.getDeadline())
                .status(r.getStatus().name())
                .requirements(r.getRequirements())
                .benefits(benefitsStr)
                .build();
    }

    @Transactional
    public List<Recruitment> createRecruitment(UUID eventId, CreateRecruitmentRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event không tồn tại"));

        // Kiểm tra: mỗi event chỉ được 1 recruitment post
        List<Recruitment> existing = recruitmentRepository.findByEvent_EventId(eventId);
        if (!existing.isEmpty()) {
            throw new RuntimeException("Sự kiện này đã có bài tuyển dụng. Mỗi sự kiện chỉ được tạo 1 bài tuyển dụng.");
        }

        CustomForm customForm = null;
        if (request.getFormId() != null) {
            customForm = customFormRepository.findById(request.getFormId())
                    .orElseThrow(() -> new RuntimeException("Form không tồn tại"));
        }

        String requirementsStr = null;
        if (request.getRequirements() != null) {
            requirementsStr = String.join("\n", request.getRequirements());
        }

        List<BenefitRecruitment> benefitRecruitments = null;
        if (request.getBenefits() != null) {
            benefitRecruitments = request.getBenefits().stream()
                    .map(b -> BenefitRecruitment.builder()
                            .title(b)
                            .icon(mapBenefitIcon(b))
                            .build())
                    .collect(java.util.stream.Collectors.toList());
        }

        RecruitmentStatus status = request.getStatus() != null ? request.getStatus() : RecruitmentStatus.DRAFT;

        List<Recruitment> savedList = new ArrayList<>();
        for (CreateRecruitmentRequest.PositionDTO pos : request.getPositions()) {
            Recruitment recruitment = Recruitment.builder()
                    .event(event)
                    .customForm(customForm)
                    .positionName(pos.getPositionName())
                    .description(request.getDescription())
                    .vacancy(pos.getVacancy())
                    .requirements(requirementsStr)
                    .benefits(benefitRecruitments)
                    .deadline(request.getDeadline())
                    .status(status)
                    .build();
            savedList.add(recruitmentRepository.save(recruitment));
        }

        return savedList;
    }

    @Transactional
    public Recruitment updateRecruitment(UUID recruitmentId, UpdateRecruitmentRequest request) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vị trí tuyển dụng"));

        if (request.getPositionName() != null)
            recruitment.setPositionName(request.getPositionName());
        if (request.getDescription() != null)
            recruitment.setDescription(request.getDescription());
        if (request.getVacancy() != null)
            recruitment.setVacancy(request.getVacancy());
        if (request.getRequirements() != null) {
            recruitment.setRequirements(String.join("\n", request.getRequirements()));
        }
        if (request.getBenefits() != null) {
            List<BenefitRecruitment> benefitRecruitments = request.getBenefits().stream()
                    .map(b -> BenefitRecruitment.builder().title(b).build())
                    .collect(java.util.stream.Collectors.toList());
            recruitment.setBenefits(benefitRecruitments);
        }
        if (request.getDeadline() != null)
            recruitment.setDeadline(request.getDeadline());
        if (request.getStatus() != null)
            recruitment.setStatus(request.getStatus());

        if (request.getFormId() != null) {
            CustomForm form = customFormRepository.findById(request.getFormId())
                    .orElseThrow(() -> new RuntimeException("Form không tồn tại"));
            recruitment.setCustomForm(form);
        }

        return recruitmentRepository.save(recruitment);
    }

    @Transactional
    public void deleteRecruitment(UUID recruitmentId) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vị trí tuyển dụng"));

        if (recruitment.getStatus() != RecruitmentStatus.DRAFT) {
            throw new RuntimeException("Chỉ có thể xoá recruitment ở trạng thái DRAFT");
        }

        recruitmentRepository.delete(recruitment);
    }

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

    private String mapBenefitIcon(String benefitTitle) {
        if (benefitTitle == null) return "gift";
        String lower = benefitTitle.toLowerCase();
        if (lower.contains("certificate") || lower.contains("award")) return "award";
        if (lower.contains("lunch") || lower.contains("food") || lower.contains("meal") || lower.contains("coffee")) return "coffee";
        if (lower.contains("stipend") || lower.contains("salary") || lower.contains("pay") || lower.contains("money")) return "star";
        if (lower.contains("remote") || lower.contains("work") || lower.contains("job")) return "briefcase";
        if (lower.contains("health") || lower.contains("insurance") || lower.contains("medical")) return "heart";
        if (lower.contains("training") || lower.contains("learn") || lower.contains("course") || lower.contains("book")) return "book";
        if (lower.contains("security") || lower.contains("safety") || lower.contains("protect")) return "shield";
        return "gift";
    }
}