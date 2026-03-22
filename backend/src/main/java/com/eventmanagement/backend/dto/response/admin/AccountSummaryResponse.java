package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountSummaryResponse {
    private long totalAccounts;
    private long activeAccounts;
    private long bannedAccounts;
}
