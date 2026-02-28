package com.eventmanagement.backend.dto.response.attendee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerResponse {
    private UUID userId;
    private String fullName;
    private String avatarUrl;
    private String email;
}