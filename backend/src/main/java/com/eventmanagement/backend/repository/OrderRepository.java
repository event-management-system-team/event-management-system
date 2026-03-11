// repository/OrderRepository.java
package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.constants.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByUserUserId(UUID userId);

    @Query("SELECT o FROM Order o WHERE o.status = :status " +
            "AND o.expiresAt < :now")
    List<Order> findExpiredPendingOrders(
            @Param("now") LocalDateTime now,
            @Param("status") OrderStatus status);
}