package com.eventmanagement.backend.model;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.Table;
import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "recruitments")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Recruitments {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="recruitment_id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "position_name", nullable = false)
    private String positionName;

    private String description;

    @Column(name = "vacancy")
    private Integer vacancy; 

    @Column(name = "approved_count")
    private Integer approvedCount; 
    private String requirements;

    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecruitmentStatus status = RecruitmentStatus.OPEN; 

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String benefits;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (vacancy == null) vacancy = 1;
        if (approvedCount == null) approvedCount = 0;
        if (status == null) status = RecruitmentStatus.OPEN;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Enum định nghĩa theo CREATE TYPE recruitment_status AS ENUM ('OPEN', 'CLOSED');
    public enum RecruitmentStatus {
        OPEN, CLOSED
    }
}
