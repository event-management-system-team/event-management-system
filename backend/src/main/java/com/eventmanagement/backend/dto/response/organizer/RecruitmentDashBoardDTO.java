package com.eventmanagement.backend.dto.response.organizer;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

 

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruitmentDashBoardDTO {
    private StatsDTO stats; // chua con so thong ke
    private List<RecruitmentItemDTO> recentRecruitments; // chua con list recruitment moi nhat

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor

    public static class StatsDTO {
      private int activeRoles;
      private int totalApplications;
      private int pendingReviews;
      private int hiredStaff;  
}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecruitmentItemDTO {
        private UUID recruitmentId;
        private String title; // ten skien+ vi tri
        private int newCount; // so luong moi
        private int currentCount; // so luong da dau
        private int total; // tong so luong can tuyen
        private String status; // recruiting/ closed
        private boolean isNew; // co moi khong

    }

}
