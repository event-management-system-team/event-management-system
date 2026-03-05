package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "event_staffs",
        uniqueConstraints = @UniqueConstraint(
                name = "unique_event_user",
                columnNames = {"event_id", "user_id"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "event_staff_id", updatable = false, nullable = false)
    private UUID eventStaffId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "staff_role", nullable = false)
    @Builder.Default
    private String staffRole = "STAFF";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }
}
