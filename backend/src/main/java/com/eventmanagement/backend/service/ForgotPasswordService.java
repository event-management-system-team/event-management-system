package com.eventmanagement.backend.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.dto.request.ForgotPasswordRequest;
import com.eventmanagement.backend.dto.request.ResetPasswordRequest;
import com.eventmanagement.backend.dto.request.VerifyOtpRequest;
import com.eventmanagement.backend.dto.response.VerifyOtpResponse;
import com.eventmanagement.backend.model.PasswordResetToken;
import com.eventmanagement.backend.repository.PasswordResetTokenRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.util.OtpUtil;
import com.eventmanagement.backend.util.ResetTokenUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final OtpUtil otpUtil;
    private final ResetTokenUtil resetTokenUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void sendOtp(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        Boolean exists = userRepository.existsByEmail(email);
        if (!exists) {
            throw new RuntimeException("Email not found");
        }

        tokenRepository.deleteByEmail(email);

        String hashOtp = otpUtil.hashOtp(otpUtil.generateOtp());

        PasswordResetToken token = PasswordResetToken.builder()
                .email(email)
                .otpHash(hashOtp)
                .otpExpiresAt(LocalDateTime.now().plusMinutes(1))
                .build();
        tokenRepository.save(token);

        emailService.sendOtpEmail(email, otpUtil.generateOtp());
    }

    @Transactional
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {

        String email = request.getEmail().toLowerCase().trim();

        PasswordResetToken token = tokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("OTP not found for email: " + email));

        if (token.getAttempts() >= 5) {
            tokenRepository.delete(token);
            throw new RuntimeException("Too many failed attempts. Please request a new OTP.");
        }

        if (token.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new RuntimeException("OTP has expired.");
        }

        if (!otpUtil.verifyOtp(request.getOtp(), token.getOtpHash())) {
            token.setAttempts(token.getAttempts() + 1);
            tokenRepository.save(token);
            throw new RuntimeException("Invalid OTP.");
        }

        String resetToken = resetTokenUtil.generateResetToken();
        token.setVerified(true);
        token.setResetToken(resetToken);
        token.setResetTokenExpiresAt(
                LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(token);

        return VerifyOtpResponse.builder().resetToken(resetToken).build();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken token = tokenRepository.findByResetToken(request.getResetToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token."));

        if (!token.isVerified()) {
            throw new RuntimeException("OTP not verified.");
        }

        if (token.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new RuntimeException("Reset token has expired.");
        }

        userRepository.findByEmail(token.getEmail()).ifPresent(user -> {
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
        });

        tokenRepository.delete(token);
    }
}
