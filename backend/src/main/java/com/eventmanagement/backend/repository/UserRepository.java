package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.eventmanagement.backend.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    Boolean existsByEmail(String email);

    Page<User> findAll(Pageable pageable);

    long countByStatus(Status status);
}
