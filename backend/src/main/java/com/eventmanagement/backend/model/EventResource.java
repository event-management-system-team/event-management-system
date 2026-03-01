package com.eventmanagement.backend.model;

import com.eventmanagement.backend.constants.ResourceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event_resources")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE event_resources SET deleted_at = CURRENT_TIMESTAMP WHERE resource_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class EventResource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "resource_id", updatable = false, nullable = false)
    private UUID resourceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "resource_name", nullable = false, length = 255)
    private String resourceName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @Column(name = "file_size")
    private Integer fileSize;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "resource_type", columnDefinition = "resource_type")
    @Builder.Default
    private ResourceType resourceType = ResourceType.DOCUMENT;

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

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
