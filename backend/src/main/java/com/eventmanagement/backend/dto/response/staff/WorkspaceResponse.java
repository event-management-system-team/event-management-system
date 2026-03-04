package com.eventmanagement.backend.dto.response.staff;

import com.eventmanagement.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
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
    }

    @Data
    @Builder
    public static class EventInfo {
        private UUID eventId;
        private String title;
        private String location;
        private String status;
    }

}