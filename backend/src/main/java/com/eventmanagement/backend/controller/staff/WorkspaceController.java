package com.eventmanagement.backend.controller.staff;

import com.eventmanagement.backend.dto.response.staff.WorkspaceResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff")
@CrossOrigin("*")
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    @GetMapping("/{eventSlug}")
    public ResponseEntity<WorkspaceResponse> getWorkspaceData(@PathVariable("eventSlug") String eventSlug,
                                                              @AuthenticationPrincipal User currentUser) {

        UUID userId = currentUser.getUserId();
        WorkspaceResponse response = workspaceService.getWorkspaceData(eventSlug, userId);
        return ResponseEntity.ok(response);
    }
}
