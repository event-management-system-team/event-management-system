package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.Status;
import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.request.RegisterRequest;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.dto.response.RefreshTokenResponse;
import com.eventmanagement.backend.dto.response.RegisterResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.constants.Role;
import com.eventmanagement.backend.constants.Status;
import com.eventmanagement.backend.util.GenerateAvatarUrl;

import jakarta.servlet.http.HttpServletResponse;

import com.eventmanagement.backend.util.CookieUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final GenerateAvatarUrl generateAvatarUrl;
    private final CookieUtil cookieUtil;

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
        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        // Lấy userId từ token
        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);

        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getStatus() == Status.BANNED) {
            throw new BadRequestException("Your account has been locked.");
        }

        // Tạo access token mới
        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name());

        // Tạo refresh token mới và update cookie
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());
        int maxAge = (int) (refreshTokenExpiration / 1000); // Convert to seconds
        cookieUtil.addRefreshTokenCookie(response, newRefreshToken, maxAge);

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .build();
    }
}