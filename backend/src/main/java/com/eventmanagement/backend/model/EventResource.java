package com.eventmanagement.backend.model;

import com.eventmanagement.backend.constants.ResourceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event_resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "resource_id", updatable = false, nullable = false)
    private UUID resourceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "resource_name", length = 255)
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
    @Column(name = "resource_type", length = 50)
    @Builder.Default
    private ResourceType resourceType = ResourceType.DOCUMENT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


}