package com.eventmanagement.backend.controller.recruitment;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.request.WorkspaceRequestDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Recruitments;
import com.eventmanagement.backend.service.RecruitmentService;


@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class RecruitmentController {


    private final RecruitmentService recruitmentService;
    private final com.eventmanagement.backend.repository.RecruitmentRepository recruitmentRepository;
    private final com.eventmanagement.backend.service.CustomFormService customFormService;
    //DI
    public RecruitmentController(RecruitmentService recruitmentService, com.eventmanagement.backend.repository.RecruitmentRepository recruitmentRepository, com.eventmanagement.backend.service.CustomFormService customFormService) {
        this.recruitmentService = recruitmentService;
        this.recruitmentRepository = recruitmentRepository;
        this.customFormService = customFormService;
    }

    @GetMapping("/recruitments/dashboard")
    public ResponseEntity<RecruitmentDashBoardDTO> getDashboardData() {
        RecruitmentDashBoardDTO response = recruitmentService.getDashBoardData();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recruitments/create")
    public ResponseEntity<?> createRecruitment(@RequestBody Recruitments recruitment) {
        try {
            // Lưu thẳng vào bảng recruitments
            // (Trong thực tế bạn nên có EventId truyền từ Frontend xuống để setEvent cho nó)
            recruitment.setStatus(Recruitments.RecruitmentStatus.OPEN);
            Recruitments savedJob = recruitmentRepository.save(recruitment);
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
            recruitmentService.saveWorkspace(eventId, request);
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
            CustomForm form = customFormService.getFormByType(eventId, "RECRUITMENT");
            workspaceData.put("form", form);
            List<Recruitments> rawPositions = recruitmentRepository.findByEvent_EventId(eventId);
            List<Map<String, Object>> safePositions = new ArrayList<>();
            for (Recruitments r : rawPositions) {
                Map<String, Object> posDto = new HashMap<>();
                posDto.put("id", r.getId());
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
    public ResponseEntity<?> getForms(
            @PathVariable UUID eventId,
            @RequestParam(defaultValue = "FEEDBACK") String type 
    ) {
    if ("RECRUITMENT".equals(type) || "FEEDBACK".equals(type)) {
                CustomForm form = customFormService.getFormByType(eventId, type);
                if (form != null) {
                    return ResponseEntity.ok(form);
                } else {
                    return ResponseEntity.noContent().build(); 
                }
            }
            return ResponseEntity.badRequest().body("Invalid form type: " + type);
    }
    
}
