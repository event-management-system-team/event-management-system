package com.eventmanagement.backend.scheduler;

import com.eventmanagement.backend.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupScheduler {

    private final RefreshTokenService refreshTokenService;

    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredTokens() {
        log.info("Starting cleanup of expired refresh tokens");
        refreshTokenService.cleanupExpiredTokens();
        log.info("Cleanup completed");
    }
}
