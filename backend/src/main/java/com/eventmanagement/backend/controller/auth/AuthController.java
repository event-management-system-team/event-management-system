package com.eventmanagement.backend.controller.auth;

import com.eventmanagement.backend.dto.request.ForgotPasswordRequest;
import com.eventmanagement.backend.dto.request.GoogleLoginRequest;
import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.request.RegisterRequest;
import com.eventmanagement.backend.dto.request.ResetPasswordRequest;
import com.eventmanagement.backend.dto.request.VerifyOtpRequest;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.dto.response.RefreshTokenResponse;
import com.eventmanagement.backend.dto.response.RegisterResponse;
import com.eventmanagement.backend.dto.response.VerifyOtpResponse;
import com.eventmanagement.backend.service.AuthService;
import com.eventmanagement.backend.service.ForgotPasswordService;
import com.eventmanagement.backend.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;
    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        String deviceInfo = httpRequest.getHeader("User-Agent");
        if (deviceInfo == null)
            deviceInfo = "Unknown Device";
        LoginResponse loginResponse = authService.login(request, deviceInfo, httpResponse);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        log.info("Received Google login request");
        String deviceInfo = httpRequest.getHeader("User-Agent");
        if (deviceInfo == null)
            deviceInfo = "Unknown Device";
        LoginResponse loginResponse = authService.loginWithGoogle(request, deviceInfo, httpResponse);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = cookieUtil.getRefreshTokenFromCookie(request).orElse(null);
        authService.logout(refreshToken, response);

        Map<String, String> result = new HashMap<>();
        result.put("message", "Logout successful");

        return ResponseEntity.ok(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = cookieUtil.getRefreshTokenFromCookie(request)
                .orElseThrow(() -> new com.eventmanagement.backend.exception.UnauthorizedException(
                        "Refresh token not found"));

        String deviceInfo = request.getHeader("User-Agent");
        if (deviceInfo == null)
            deviceInfo = "Unknown Device";

        RefreshTokenResponse tokenResponse = authService.refreshToken(refreshToken, deviceInfo, response);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        forgotPasswordService.sendOtp(request);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        VerifyOtpResponse response = forgotPasswordService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        forgotPasswordService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }
}