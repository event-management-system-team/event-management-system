package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.Status;
import com.eventmanagement.backend.dto.request.GoogleLoginRequest;
import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.request.RegisterRequest;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.dto.response.RefreshTokenResponse;
import com.eventmanagement.backend.dto.response.RegisterResponse;
import com.eventmanagement.backend.dto.response.GoogleLoginResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.constants.Role;
import com.eventmanagement.backend.util.GenerateAvatarUrl;

import jakarta.servlet.http.HttpServletResponse;

import com.eventmanagement.backend.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final GenerateAvatarUrl generateAvatarUrl;
    private final CookieUtil cookieUtil;
    private final GoogleOAuthService googleOAuthService;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public RegisterResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .avatarUrl(generateAvatarUrl.generateAvatarUrl(request.getFullName()))
                .role(Role.ATTENDEE)
                .status(Status.ACTIVE)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return RegisterResponse.builder()
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .phone(savedUser.getPhone())
                .avatarUrl(savedUser.getAvatarUrl())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .message("Registration successful! Please log in to continue.")
                .build();
    }

    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Incorrect email or password"));

        if (user.getStatus().name().equals("BANNED")) {
            throw new BadRequestException("Your account has been locked.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name());

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());

        int maxAge = request.isRememberMe() ? (int) (refreshTokenExpiration / 60) : -1;
        cookieUtil.addRefreshTokenCookie(response, refreshToken, maxAge);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .user(LoginResponse.UserInfor.builder()
                        .user_id(user.getUserId())
                        .email(user.getEmail())
                        .full_name(user.getFullName())
                        .avatar_url(user.getAvatarUrl())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Transactional
    public LoginResponse loginWithGoogle(GoogleLoginRequest request, HttpServletResponse response) {
        log.info("Processing Google login...");

        GoogleLoginResponse googleUser = googleOAuthService.verifyGoogleToken(request.getGoogleToken());

        log.info("Google user info retrieved: {}", googleUser.getEmail());

        User user = userRepository.findByGoogleId(googleUser.getSub())
                .or(() -> userRepository.findByEmail(googleUser.getEmail()))
                .orElseGet(() -> {
                    log.info("Creating new user from Google account: {}", googleUser.getEmail());
                    return userRepository.save(User.builder()
                            .email(googleUser.getEmail())
                            .fullName(googleUser.getName())
                            .avatarUrl(googleUser.getPicture())
                            .googleId(googleUser.getSub())
                            .emailVerified(googleUser.getEmailVerified())
                            .role(Role.ATTENDEE)
                            .status(Status.ACTIVE)
                            .passwordHash("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build());
                });

        if (user.getGoogleId() == null) {
            log.info("Linking existing user with Google ID: {}", googleUser.getEmail());
            user.setGoogleId(googleUser.getSub());
        }

        if (user.getStatus() == Status.BANNED) {
            throw new BadRequestException("Your account has been locked.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setEmailVerified(googleUser.getEmailVerified());
        user.setAvatarUrl(googleUser.getPicture());
        userRepository.save(user);

        log.info("Google login successful for user: {}", user.getEmail());

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name());

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());

        int maxAge = (int) refreshTokenExpiration / 60;
        cookieUtil.addRefreshTokenCookie(response, refreshToken, maxAge);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .user(LoginResponse.UserInfor.builder()
                        .user_id(user.getUserId())
                        .email(user.getEmail())
                        .full_name(user.getFullName())
                        .avatar_url(user.getAvatarUrl())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Transactional
    public RefreshTokenResponse refreshToken(String refreshToken, HttpServletResponse response) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getStatus() == Status.BANNED) {
            throw new BadRequestException("Your account has been locked.");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name());

        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());
        int maxAge = (int) (refreshTokenExpiration / 1000);
        cookieUtil.addRefreshTokenCookie(response, newRefreshToken, maxAge);

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .build();
    }

    public void logout(HttpServletResponse response) {
        cookieUtil.removeRefreshTokenCookie(response);
    }
}