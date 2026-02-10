package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Incorrect email or password"));

        // Kiểm tra tài khoản bị ban
        if (user.getStatus().name().equals("BANNED")) {
            throw new BadRequestException("Your account has been locked.");
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect email or password");
        }

        // Cập nhật last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Tạo tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name());

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());

        // Build response
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(LoginResponse.UserInfor.builder()
                        .user_id(user.getUserId())
                        .email(user.getEmail())
                        .full_name(user.getFullName())
                        .avatar_url(user.getAvatarUrl())
                        .role(user.getRole())
                        .build())
                .build();
    }
}