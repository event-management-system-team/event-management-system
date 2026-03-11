package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDistributionResponse {
    private String categoryName;
    private String colorCode;
    private Long count;
}
