package com.eventmanagement.backend.controller.application;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.request.UpdateApplicationStatusRequest;
import com.eventmanagement.backend.dto.response.attendee.StaffApplicationResponse;
import com.eventmanagement.backend.dto.response.organizer.ApplicationResponseDTO;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.ApplicationService;
import com.eventmanagement.backend.service.organizer.ApplicationServiceOrganizer;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationServiceOrganizer applicationServiceOrganizer;
    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<StaffApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal User currentUser) {

        UUID userId = currentUser.getUserId();
        List<StaffApplicationResponse> response = applicationService.getMyApplications(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recruitments/{recruitmentId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByRecruitment(
            @PathVariable UUID recruitmentId) {
        List<ApplicationResponseDTO> applications = applicationServiceOrganizer.getApplicationsByRecruitment(recruitmentId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponseDTO> getApplicationDetail(@PathVariable UUID applicationId) {
        ApplicationResponseDTO detail = applicationServiceOrganizer.getApplicationDetail(applicationId);
        return ResponseEntity.ok(detail);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable UUID applicationId, 
            @RequestBody UpdateApplicationStatusRequest request) {
        try {
            if (request.getStatus() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Trạng thái (status) không được để trống!"
                ));
            }

            StaffApplication updatedApp = applicationServiceOrganizer.updateApplicationStatuss(applicationId, request.getStatus());
            
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái ứng viên thành công!",
                "status", updatedApp.getApplicationStatus() 
            ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Lỗi hệ thống: " + e.getMessage()
            ));
        }
    }
}
