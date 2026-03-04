package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserUserIdOrderByCreatedAtDesc(UUID userId);

    List<Order> findByEventEventIdOrderByCreatedAtDesc(UUID eventId);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt <= :expiredTime")
    List<Order> findExpiredOrders(@Param("status") OrderStatus status, @Param("expiredTime") LocalDateTime expiredTime);
}
