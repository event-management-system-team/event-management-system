package com.eventmanagement.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.eventmanagement.backend.model.User;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    Boolean existsByEmail(String email);
}
