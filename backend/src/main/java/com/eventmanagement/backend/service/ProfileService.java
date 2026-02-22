package com.eventmanagement.backend.service;

import java.util.UUID;

import org.checkerframework.checker.units.qual.s;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.dto.request.ChangePasswordRequest;
import com.eventmanagement.backend.dto.request.UpdateProfileRequest;
import com.eventmanagement.backend.dto.response.ProfileResponse;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileResponse getProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ProfileResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }

        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);

        return ProfileResponse.builder()
                .userId(updatedUser.getUserId())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .phone(updatedUser.getPhone())
                .avatarUrl(updatedUser.getAvatarUrl())
                .role(updatedUser.getRole())
                .emailVerified(updatedUser.getEmailVerified())
                .createdAt(updatedUser.getCreatedAt())
                .lastLoginAt(updatedUser.getLastLoginAt())
                .build();
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        log.info("Changing password for user: {}", userId);

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Confirm password does not match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new BadRequestException("Google login users cannot change password");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", userId);
    }

    @Transactional
    public String uploadAvatar(UUID userId, String avatarUrl) {
        log.info("Uploading avatar for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        log.info("Avatar uploaded successfully for user: {}", userId);
        return avatarUrl;
    }
}
