package com.eventmanagement.backend.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "event_staffs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "staff_id")
    private UUID staffId;

    // Liên kết với bảng events
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Chống lỗi JSON khi GET
    private Event event;

    // Liên kết với bảng users (Ứng viên được duyệt thành Staff)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    // Vai trò/Vị trí của nhân sự (Ví dụ: Security Guard, Registration Desk)
    @Column(name = "staff_role", length = 100, nullable = false)
    private String staffRole;

    // Liên kết với bảng users (Người của Ban tổ chức đã bấm duyệt) - Có thể null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User assignedBy;

    // Thời gian được phân công/duyệt
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    // Tự động gán thời gian hiện tại khi Insert vào Database
    @PrePersist
    protected void onCreate() {
        if (this.assignedAt == null) {
            this.assignedAt = LocalDateTime.now();
        }
    }
}
