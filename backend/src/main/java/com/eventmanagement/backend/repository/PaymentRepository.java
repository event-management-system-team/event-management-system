package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Payment;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByVnpayTxnRef(String vnpayTxnRef);

    Optional<Payment> findByOrderOrderId(UUID orderId);
}
