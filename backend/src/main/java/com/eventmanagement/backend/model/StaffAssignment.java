package com.eventmanagement.backend.model;

import com.eventmanagement.backend.constants.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "staff_assignments",
        uniqueConstraints = @UniqueConstraint(
                name = "unique_staff_schedule",
                columnNames = {"schedule_id", "event_staff_id"}
        )
)
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "assignment_id", updatable = false, nullable = false)
    private UUID assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "schedule_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_assignment_schedule")
    )
    private StaffSchedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "event_staff_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_assignment_event_staff")
    )
    private EventStaff eventStaff;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.ASSIGNED;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime assignedAt;
    }