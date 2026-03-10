package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventAnalyticsRepository extends JpaRepository<EventAnalytics, UUID> {

    @Query(value = """
        SELECT
        e.event_id,
        e.event_name,
        e.category_id,
        c.category_name,
        e.banner_url,
        e.start_date,
        e.end_date,
        e.total_capacity,
        e.status,
        ea.total_tickets_sold,
        ea.total_revenue,
        ea.total_checkins,
        ea.total_registrations
        FROM event_analytics ea
        JOIN events e ON ea.event_id = e.event_id
        LEFT JOIN event_categories c ON e.category_id = c.category_id
        WHERE e.status IN ('ONGOING','APPROVED', 'COMPLETED')
        ORDER BY ea.calculated_at DESC;
        """, nativeQuery = true)
    List<Object[]> getAnalyticsDashboard();

    @Query(value = """
        SELECT 
        SUM(ea.total_tickets_sold) AS totalTicketsSold,
        SUM(ea.total_revenue) AS totalRevenue,
        AVG(
        CASE 
            WHEN ea.total_registrations = 0 THEN 0
            ELSE ea.total_checkins * 1.0 / ea.total_registrations
        END
        ) AS avgAttendanceRate,
        COUNT(ea.event_id) AS totalEvents,
        COUNT(DISTINCT CASE
            WHEN e.status IN ('ONGOING','APPROVED')
            THEN ea.event_id
            END) AS activeEvents
        FROM event_analytics ea
        JOIN events e ON ea.event_id = e.event_id
        WHERE e.status IN ('APPROVED','ONGOING','COMPLETED')
        """, nativeQuery = true)
    Object getAnalyticsSummary();

    @Query(value = """
        SELECT 
        DATE_TRUNC('month', e.start_date) AS month,
        SUM(ea.total_tickets_sold) AS tickets_sold,
        SUM(ea.total_revenue) AS revenue
        FROM event_analytics ea
        JOIN events e ON ea.event_id = e.event_id
        WHERE e.status IN ('ONGOING','COMPLETED')
        GROUP BY DATE_TRUNC('month', e.start_date)
        ORDER BY month
        """, nativeQuery = true)
    List<Object[]> getMonthlyTicketSales();

    @Query(value = """
    SELECT 
        e.event_name,
        SUM(ea.total_revenue) AS revenue
    FROM event_analytics ea
    JOIN events e ON ea.event_id = e.event_id
    GROUP BY e.event_id, e.event_name
    ORDER BY revenue DESC
    LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTopRevenueEvents();

    @Query(value = """
    SELECT
        ec.category_name,
        ec.color_code,
        COUNT(e.event_id) AS event_count
    FROM events e
    JOIN event_categories ec
    ON e.category_id = ec.category_id
    GROUP BY
        e.category_id,
        ec.category_name,
        ec.color_code
    ORDER BY event_count DESC;
    """, nativeQuery = true)
    List<Object[]> getCategoryDistribution();

    @Query(value = """
SELECT
    COUNT(e.event_id) AS total_events,

    COUNT(CASE 
        WHEN e.status IN ('APPROVED','ONGOING') 
        THEN 1 
    END) AS active_events,

    COUNT(CASE 
        WHEN e.status = 'PENDING' 
        THEN 1 
    END) AS pending_events,

    (
        SELECT COUNT(*)
        FROM users
        WHERE role = 'ORGANIZER'
    ) AS organizer_accounts,

    (
        SELECT COUNT(*)
        FROM users
        WHERE status = 'BANNED'
    ) AS banned_accounts

FROM events e
""", nativeQuery = true)
    Object getDashboardSummary();
}
