package com.eventmanagement.backend.controller.profile;

import com.eventmanagement.backend.dto.request.ChangePasswordRequest;
import com.eventmanagement.backend.dto.request.UpdateProfileRequest;
import com.eventmanagement.backend.dto.response.ProfileResponse;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
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
            @RequestParam String avatarUrl,
            HttpServletRequest httpRequest) {
        UUID userId = getUserIdFromRequest(httpRequest);
        String url = profileService.uploadAvatar(userId, avatarUrl);

        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", url);
        response.put("message", "Avatar uploaded successfully");

        return ResponseEntity.ok(response);
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
