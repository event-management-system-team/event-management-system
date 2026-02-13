package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.GoogleLoginResponse;
import com.eventmanagement.backend.exception.BadRequestException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class GoogleOAuthService {

    @Value("${security.oauth2.client.registration.google.client-id}")
    private String clientId;

    public GoogleLoginResponse verifyGoogleToken(String idTokenString) {
        try {
            log.info("Verifying Google token (length: {})...", idTokenString.length());
            log.info("Using Client ID: {}", clientId);

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                log.error("Token verification returned null - Token invalid or expired");
                throw new BadRequestException("The Google token is invalid or has expired.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            GoogleLoginResponse userInfo = new GoogleLoginResponse();
            userInfo.setSub(payload.getSubject());
            userInfo.setEmail(payload.getEmail());
            userInfo.setName((String) payload.get("name"));
            userInfo.setPicture((String) payload.get("picture"));
            userInfo.setEmailVerified(payload.getEmailVerified());

            log.info("Token verified successfully for: {}", userInfo.getEmail());
            return userInfo;

        } catch (Exception e) {
            log.error("Token verification failed: {}", e.getMessage(), e);
            throw new BadRequestException("Google authentication failed: " + e.getMessage());
        }
    }
}