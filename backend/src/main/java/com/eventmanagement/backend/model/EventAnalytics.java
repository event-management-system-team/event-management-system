package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "event_analytics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "analytics_id", updatable = false, nullable = false)
    private UUID analyticsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "report_date")
    private LocalDate reportDate;

    @Column(name = "total_registrations")
    private Integer totalRegistrations = 0;

    @Column(name = "total_checkins")
    private Integer totalCheckins = 0;

    @Column(name = "total_tickets_sold")
    private Integer totalTicketsSold = 0;

    @Column(name = "total_revenue")
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "performance_metrics", columnDefinition = "jsonb")
    private Map<String, Object> performanceMetrics;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "demographic_data", columnDefinition = "jsonb")
    private Map<String, Object> demographicData;

    @CreationTimestamp
    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;
}
