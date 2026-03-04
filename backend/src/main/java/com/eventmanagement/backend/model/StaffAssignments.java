package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "staff_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_staff_schedule",
                        columnNames = {"schedule_id", "event_staff_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Spring Boot 3 / Hibernate 6 hỗ trợ chuẩn UUID này
    @Column(name = "assignment_id", updatable = false, nullable = false)
    private UUID assignmentId;

    // --- RELATIONSHIPS ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private StaffSchedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_staff_id", nullable = false)
    private EventStaff eventStaff;

    // --- BASIC FIELDS ---

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.ASSIGNED; // Cài mặc định theo DB

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp // Tự động lấy giờ hiện tại khi insert vào DB
    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    // Enum định nghĩa trạng thái phân công
    public enum AssignmentStatus {
        ASSIGNED,   // Đã phân công
        CONFIRMED,  // Staff đã xác nhận sẽ làm
        CANCELLED,  // Hủy phân công
        COMPLETED   // Đã hoàn thành ca
    }
}