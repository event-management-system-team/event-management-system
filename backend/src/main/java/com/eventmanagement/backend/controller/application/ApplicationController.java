package com.eventmanagement.backend.controller.application;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.request.UpdateApplicationStatusRequest;
import com.eventmanagement.backend.dto.response.organizer.ApplicationResponseDTO;
import com.eventmanagement.backend.service.ApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1") 
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Hoặc config CORS ở file WebSecurityConfig
public class ApplicationController {

    private final ApplicationService applicationService;

    // 1. API lấy danh sách ứng viên theo chiến dịch
    @GetMapping("/recruitments/{recruitmentId}/applications")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByRecruitment(
            @PathVariable UUID recruitmentId) {
        List<ApplicationResponseDTO> applications = applicationService.getApplicationsByRecruitment(recruitmentId);
        return ResponseEntity.ok(applications);
    }

    // 2. API cập nhật trạng thái đơn ứng tuyển (Approve / Reject)
    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestBody UpdateApplicationStatusRequest request) {
        
        applicationService.updateApplicationStatus(applicationId, request.getStatus());
        
        // Trả về message thành công đơn giản hoặc một Object JSON
        return ResponseEntity.ok().body("{\"message\": \"Cập nhật trạng thái thành công!\"}");
    }
}
