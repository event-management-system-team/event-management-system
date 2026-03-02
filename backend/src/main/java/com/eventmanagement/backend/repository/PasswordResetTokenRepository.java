package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByEmail(String email);

    Optional<PasswordResetToken> findByResetToken(String resetToken);

    void deleteByEmail(String email);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.otpExpiresAt < :now AND t.verified = false")
    void deleteExpiredUnverified(LocalDateTime now);
}