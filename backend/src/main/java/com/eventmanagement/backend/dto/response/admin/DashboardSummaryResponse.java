package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    private Long totalEvents;
    private Long activeEvents;
    private Long pendingEvents;
    private Long organizerAccounts;
    private Long bannedAccounts;

}
