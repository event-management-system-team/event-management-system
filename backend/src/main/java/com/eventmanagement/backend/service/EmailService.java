package com.eventmanagement.backend.service;

import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.model.Ticket;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.util.QrCodeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final QrCodeUtil qrCodeUtil;

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
            helper.setText(buildOtpTemplate(otp), true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendTicketEmail(User user, Order order, List<Ticket> tickets) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("🎫 Your Tickets — " + order.getEvent().getEventName());

            StringBuilder html = new StringBuilder(buildTicketEmailHeader(user, order));

            for (Ticket ticket : tickets) {
                String cid = "qr-" + ticket.getTicketCode();
                html.append(buildTicketBlock(ticket, cid));
            }

            html.append(buildTicketEmailFooter());
            helper.setText(html.toString(), true);

            for (Ticket ticket : tickets) {
                try {
                    byte[] qrBytes = qrCodeUtil.generateQrCode(ticket.getTicketCode());
                    String cid = "qr-" + ticket.getTicketCode();
                    helper.addInline(cid, new ByteArrayResource(qrBytes), "image/png");
                } catch (Exception e) {
                    log.error("Failed to generate QR for ticket {}: {}", ticket.getTicketCode(), e.getMessage());
                }
            }

            mailSender.send(message);
            log.info("[Email] Ticket email sent to {} for order {}", user.getEmail(), order.getOrderCode());

        } catch (Exception e) {
            log.error("[Email] Failed to send ticket email for order {}: {}", order.getOrderCode(), e.getMessage());
        }
    }

    private String buildOtpTemplate(String otp) {
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

    private String buildTicketEmailHeader(User user, Order order) {
        String eventName = order.getEvent().getEventName();
        String location = order.getEvent().getLocation() != null ? order.getEvent().getLocation() : "TBA";
        String startDate = order.getEvent().getStartDate() != null
                ? order.getEvent().getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "TBA";
        String userName = user.getFullName() != null ? user.getFullName() : user.getEmail();

        return """
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#f8fafc;padding:24px;border-radius:16px">
                  <!-- Header -->
                  <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:32px;text-align:center;margin-bottom:24px">
                    <h1 style="color:#fff;margin:0;font-size:28px">🎫 EventHub</h1>
                    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0">Your ticket is confirmed!</p>
                  </div>

                  <!-- Event Info -->
                  <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
                    <h2 style="color:#1e293b;margin:0 0 16px">%s</h2>
                    <p style="color:#64748b;margin:4px 0">👋 Hi <strong>%s</strong></p>
                    <p style="color:#64748b;margin:4px 0">📅 %s</p>
                    <p style="color:#64748b;margin:4px 0">📍 %s</p>
                    <p style="color:#64748b;margin:4px 0">🧾 Order: <strong>%s</strong></p>
                  </div>

                  <h3 style="color:#374151;margin:0 0 12px">Your Tickets</h3>
                """
                .formatted(eventName, userName, startDate, location, order.getOrderCode());
    }

    private String buildTicketBlock(Ticket ticket, String qrCid) {
        String ticketTypeName = ticket.getTicketType() != null
                ? ticket.getTicketType().getTicketName()
                : "Free Admission";
        String price = ticket.getPrice() != null && ticket.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0
                ? String.format("%,.0f VNĐ", ticket.getPrice())
                : "Free";

        return """
                <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;
                            box-shadow:0 1px 4px rgba(0,0,0,0.06);display:flex;align-items:center;
                            border-left:4px solid #667eea">
                  <div style="flex:1">
                    <p style="margin:0 0 4px;font-weight:bold;color:#1e293b;font-size:16px">%s</p>
                    <p style="margin:0 0 4px;color:#64748b;font-size:13px">
                      🎟 Ticket Code: <strong style="font-family:monospace;color:#667eea">%s</strong>
                    </p>
                    <p style="margin:0;color:#64748b;font-size:13px">💰 %s</p>
                  </div>
                  <div style="text-align:center;margin-left:16px">
                    <img src="cid:%s" width="120" height="120" alt="QR Code"
                         style="border-radius:8px;border:1px solid #e2e8f0"/>
                    <p style="margin:4px 0 0;font-size:10px;color:#94a3b8">Scan to check-in</p>
                  </div>
                </div>
                """.formatted(ticketTypeName, ticket.getTicketCode(), price, qrCid);
    }

    private String buildTicketEmailFooter() {
        return """
                  <div style="text-align:center;margin-top:24px;padding:16px;
                              color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0">
                    <p style="margin:0">Please present this QR code at the event entrance.</p>
                    <p style="margin:4px 0 0">© 2026 EventHub. All rights reserved.</p>
                  </div>
                </div>
                """;
    }
}