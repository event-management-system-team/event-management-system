package com.eventmanagement.backend.model;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "recruitments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recruitment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "recruitment_id", updatable = false, nullable = false)
    private UUID recruitmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "position_name", nullable = false)
    private String positionName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column()
    @Builder.Default
    private Integer vacancy = 1;

    @Column(name = "approved_count")
    @Builder.Default
    private Integer approvedCount = 0;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    @Builder.Default
    private RecruitmentStatus status = RecruitmentStatus.OPEN;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "benefits", columnDefinition = "jsonb")
    private List<BenefitRecruitment> benefits;
}