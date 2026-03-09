package com.eventmanagement.backend.controller.recruitment;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.dto.request.WorkspaceRequestDTO;
import com.eventmanagement.backend.dto.response.attendee.ApplicationFormResponse;
import com.eventmanagement.backend.dto.response.attendee.RecruitmentResponse;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.service.ApplicationFormService;
import com.eventmanagement.backend.service.CloudinaryService;
import com.eventmanagement.backend.service.attendee.RecruitmentService;
import com.eventmanagement.backend.service.organizer.CustomFormService;
import com.eventmanagement.backend.service.organizer.RecruitmentServiceOrganizer;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/recruitments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;
    private final ApplicationFormService applicationFormService;
    private final CloudinaryService cloudinaryService;
    private final CustomFormService customFormService;
    private final RecruitmentRepository recruitmentRepository;
    private final RecruitmentServiceOrganizer recruitmentServiceOrganizer;


    @GetMapping("/recent")
    public ResponseEntity<List<RecruitmentResponse>> getRecentRecruitment() {
        List<RecruitmentResponse> recruitments = (List<RecruitmentResponse>) recruitmentService.getRecentRecruitments();
        return ResponseEntity.ok(recruitments);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecruitmentResponse>> searchRecruitment(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate deadline,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RecruitmentResponse> responses = recruitmentService.searchRecruitments(keyword, location, deadline, page, size);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{eventSlug}")
    public ResponseEntity<RecruitmentResponse> getRecruitmentByEvent_EventSlug(@PathVariable("eventSlug") String eventSlug) {
        RecruitmentResponse response = recruitmentService.getRecruitmentByEventSlug(eventSlug);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{eventSlug}/apply-staff")
    public ResponseEntity<ApplicationFormResponse> getApplicationForm(@PathVariable String eventSlug) {
        ApplicationFormResponse response = applicationFormService.getFormForAttendee(eventSlug);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/{eventSlug}/apply-staff", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitApplication(
            @PathVariable String eventSlug,
            @RequestParam("recruitmentId") UUID recruitmentId,
            @RequestParam("userId") UUID userId,
            @RequestParam("answers") String answersJson,
            @RequestParam(value = "files", required = false) MultipartFile cv
    ) {
        try {
            applicationFormService.submitApplication(recruitmentId, userId, answersJson, cv);
            return ResponseEntity.ok().body("Success!!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboards")
    public ResponseEntity<RecruitmentDashBoardDTO> getDashboardData() {
        RecruitmentDashBoardDTO response = recruitmentServiceOrganizer.getDashBoardData();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRecruitment(@RequestBody Recruitment recruitment) {
        try {
            // Lưu thẳng vào bảng recruitments
            // (Trong thực tế bạn nên có EventId truyền từ Frontend xuống để setEvent cho nó)
            recruitment.setStatus(RecruitmentStatus.OPEN);
            Recruitment savedJob = recruitmentRepository.save(recruitment);
            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo công việc: " + e.getMessage());
        }
    }

    @PostMapping("/events/{eventId}/workspace")
    public ResponseEntity<?> saveRecruitmentWorkspace(
            @PathVariable UUID eventId,
            @RequestBody WorkspaceRequestDTO request) {
        try {
            recruitmentServiceOrganizer.saveWorkspace(eventId, request);
            return ResponseEntity.ok("Đã lưu toàn bộ Workspace thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lưu Workspace: " + e.getMessage());
        }
    }

    @GetMapping("/events/{eventId}/workspace")
    public ResponseEntity<?> getRecruitmentWorkspace(@PathVariable UUID eventId) {
        try {
            Map<String, Object> workspaceData = new HashMap<>();
            CustomForm form = customFormService.getFormByType(eventId, FormType.RECRUITMENT);
            workspaceData.put("form", form);
            List<Recruitment> rawPositions = recruitmentRepository.findByEvent_EventId(eventId);
            List<Map<String, Object>> safePositions = new ArrayList<>();
            for (Recruitment r : rawPositions) {
                Map<String, Object> posDto = new HashMap<>();
                posDto.put("id", r.getRecruitmentId());
                posDto.put("positionName", r.getPositionName());
                posDto.put("vacancy", r.getVacancy());
                safePositions.add(posDto);
            }

            workspaceData.put("positions", safePositions);

            return ResponseEntity.ok(workspaceData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tải Workspace: " + e.getMessage());
        }
    }


    @GetMapping("/events/{eventId}/forms")
    public ResponseEntity<?> getForm(@PathVariable UUID eventId, @RequestParam("type") String typeStr) {

        FormType type = FormType.valueOf(typeStr.toUpperCase());
        return ResponseEntity.ok(customFormService.getFormByType(eventId, type));
    }
}
