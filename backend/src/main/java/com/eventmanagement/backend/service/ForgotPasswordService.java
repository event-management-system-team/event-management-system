package com.eventmanagement.backend.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.exception.BadRequestException;

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
            throw new BadRequestException("Email not found");
        }

        String rawOtp = otpUtil.generateOtp();
        String hashOtp = otpUtil.hashOtp(rawOtp);

        PasswordResetToken token = tokenRepository.findByEmail(email).orElse(new PasswordResetToken());
        token.setEmail(email);
        token.setOtpHash(hashOtp);
        token.setOtpExpiresAt(LocalDateTime.now().plusMinutes(1));
        token.setAttempts(0);
        token.setVerified(false);
        token.setResetToken(null);
        token.setResetTokenExpiresAt(null);

        tokenRepository.save(token);

        emailService.sendOtpEmail(email, rawOtp);
    }

    @Transactional
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {

        String email = request.getEmail().toLowerCase().trim();

        PasswordResetToken token = tokenRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("OTP not found for email: " + email));

        if (token.getAttempts() >= 5) {
            tokenRepository.delete(token);
            throw new BadRequestException("Too many failed attempts. Please request a new OTP.");
        }

        if (token.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new BadRequestException("OTP has expired.");
        }

        if (!otpUtil.verifyOtp(request.getOtp(), token.getOtpHash())) {
            token.setAttempts(token.getAttempts() + 1);
            tokenRepository.save(token);
            throw new BadRequestException("Invalid OTP.");
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
                .orElseThrow(() -> new BadRequestException("Invalid reset token."));

        if (!token.isVerified()) {
            throw new BadRequestException("OTP not verified.");
        }

        if (token.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new BadRequestException("Reset token has expired.");
        }

        userRepository.findByEmail(token.getEmail()).ifPresent(user -> {
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
        });

        tokenRepository.delete(token);
    }
}
