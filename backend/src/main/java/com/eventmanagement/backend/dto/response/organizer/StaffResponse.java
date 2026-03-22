package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponse {
    private UUID staffId;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String role;
}

