package com.eventmanagement.backend.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP Code");
            helper.setText(buildEmailTemplate(otp), true);

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildEmailTemplate(String otp) {
        return """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;
                            background:#fff;border-radius:12px;padding:32px;
                            box-shadow:0 2px 8px rgba(0,0,0,0.08)">
                  <h2 style="color:#1e293b">EventHub</h2>
                  <p style="color:#64748b">You have requested a password reset.</p>
                  <p style="color:#374151;margin-top:20px">Your OTP code:</p>
                  <div style="font-size:36px;font-weight:bold;letter-spacing:10px;
                              color:#89A8B2;text-align:center;padding:20px 0">
                    %s
                  </div>
                  <p style="color:#9ca3af;font-size:12px">
                    Code has an expiration time of <strong>1 minute</strong>.
                    If you did not request this, please ignore this email.
                  </p>
                </div>
                """.formatted(otp);
    }
}
