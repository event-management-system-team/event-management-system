package com.eventmanagement.backend.controller.profile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventmanagement.backend.dto.request.ChangePasswordRequest;
import com.eventmanagement.backend.dto.request.UpdateProfileRequest;
import com.eventmanagement.backend.dto.response.ProfileResponse;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.service.ProfileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(HttpServletRequest request) {
        UUID userId = getUserIdFromRequest(request);
        ProfileResponse profile = profileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable UUID userId) {
        ProfileResponse profile = profileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            HttpServletRequest httpRequest) {
        UUID userId = getUserIdFromRequest(httpRequest);
        ProfileResponse profile = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {
        UUID userId = getUserIdFromRequest(httpRequest);
        profileService.changePassword(userId, request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest httpRequest) {
        try {
            log.info("Received avatar upload request");
            log.info("File name: {}", file.getOriginalFilename());
            log.info("File size: {} bytes", file.getSize());
            log.info("Content type: {}", file.getContentType());

            UUID userId = getUserIdFromRequest(httpRequest);
            String avatarUrl = profileService.uploadAvatar(userId, file);

            Map<String, String> response = new HashMap<>();
            response.put("avatarUrl", avatarUrl);
            response.put("message", "Avatar uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Avatar upload failed: {}", e.getMessage(), e);

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    private UUID getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
