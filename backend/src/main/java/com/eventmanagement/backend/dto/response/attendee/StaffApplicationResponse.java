package com.eventmanagement.backend.dto.response.attendee;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffApplicationResponse {
    private UUID applicationId;
    private UUID recruitmentId;
    private String positionName;
    private String eventName;
    private String location;
    private String bannerUrl;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
}
