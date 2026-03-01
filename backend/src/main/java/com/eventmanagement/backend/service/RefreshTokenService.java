package com.eventmanagement.backend.service;

import com.eventmanagement.backend.model.RefreshToken;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.repository.RefreshTokenRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public String createRefreshToken(User user, String deviceInfo) {
        log.info("Creating refresh token for user: {}", user.getEmail());

        String rawToken = jwtTokenProvider.generateRefreshToken(user.getUserId());

        String hashedToken = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(hashedToken)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .deviceInfo(deviceInfo)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        log.info("Refresh token created for user: {}", user.getEmail());

        return rawToken;
    }

    @Transactional
    public String rotateRefreshToken(String rawToken, String deviceInfo) {
        log.info("Rotating refresh token");

        try {
            UUID userId = jwtTokenProvider.getUserIdFromToken(rawToken);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UnauthorizedException("User not found"));

            List<RefreshToken> userTokens = refreshTokenRepository.findByUser(user);

            RefreshToken matchedToken = null;
            for (RefreshToken token : userTokens) {
                if (hashToken(rawToken).equals(token.getToken())) {
                    matchedToken = token;
                    break;
                }
            }

            if (matchedToken == null) {
                log.error("Refresh token not found in database");
                throw new UnauthorizedException("Invalid refresh token");
            }

            if (matchedToken.getRevoked()) {
                log.error("🚨 REUSE DETECTED! Token already revoked for user: {}", userId);

                refreshTokenRepository.revokeAllUserTokens(matchedToken.getUser());

                throw new UnauthorizedException("Token reuse detected. All sessions revoked.");
            }

            if (matchedToken.isExpired()) {
                throw new UnauthorizedException("Refresh token expired");
            }

            matchedToken.setRevoked(true);
            refreshTokenRepository.save(matchedToken);

            String newRawToken = createRefreshToken(matchedToken.getUser(), deviceInfo);

            log.info("Refresh token rotated successfully for user: {}", userId);

            return newRawToken;

        } catch (Exception e) {
            log.error("Refresh token rotation failed: {}", e.getMessage());
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }

    @Transactional
    public void revokeToken(String rawToken) {
        try {
            UUID userId = jwtTokenProvider.getUserIdFromToken(rawToken);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UnauthorizedException("User not found"));

            List<RefreshToken> userTokens = refreshTokenRepository.findByUser(user);

            for (RefreshToken token : userTokens) {
                if (hashToken(rawToken).equals(token.getToken())) {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                    log.info("Refresh token revoked for user: {}", userId);
                    return;
                }
            }
        } catch (Exception e) {
            log.error("Failed to revoke token: {}", e.getMessage());
        }
    }

    @Transactional
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllUserTokens(user);
        log.info("All refresh tokens revoked for user: {}", user.getEmail());
    }

    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Expired refresh tokens cleaned up");
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}