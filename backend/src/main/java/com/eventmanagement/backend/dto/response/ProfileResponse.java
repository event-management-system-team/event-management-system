package com.eventmanagement.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.eventmanagement.backend.constants.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {

    private UUID userId;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private Role role;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
