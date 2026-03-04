package com.eventmanagement.backend.dto.response.staff;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class WorkspaceResponse {

    private UUID eventStaffId;
    private UserInfo userInfo;
    private EventInfo eventInfo;
    private String staffRole;


    private List<ScheduleResponse> schedules;
    private List<ResourceResponse> resources;

    @Data
    @Builder
    public static class UserInfo {
        private String fullName;
        private String avatarUrl;
    }

    @Data
    @Builder
    public static class EventInfo {
        private UUID eventId;
        private String eventName;
        private String location;
        private String bannerUrl;
        private LocalDateTime startDate;
    }

}