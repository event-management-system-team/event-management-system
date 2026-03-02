package com.eventmanagement.backend.controller.application;

import com.eventmanagement.backend.dto.response.attendee.StaffApplicationResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {
    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<StaffApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal User currentUser) {

        UUID userId = currentUser.getUserId();
        List<StaffApplicationResponse> response = applicationService.getMyApplications(userId);
        return ResponseEntity.ok(response);
    }

}
