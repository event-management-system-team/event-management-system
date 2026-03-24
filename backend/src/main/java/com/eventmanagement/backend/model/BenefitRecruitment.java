package com.eventmanagement.backend.model;

import java.io.Serializable;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BenefitRecruitment implements Serializable {
    private String icon;
    private String title;
    private String description;
}
