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
            helper.setSubject("Your OTP Code — EventHub");
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
            helper.setSubject("Your Tickets — " + order.getEvent().getEventName());

            StringBuilder html = new StringBuilder(buildTicketEmailHeader(user, order));
            for (Ticket ticket : tickets) {
                String cid = "qr-" + ticket.getTicketCode();
                html.append(buildTicketBlock(ticket, cid));
            }
            html.append(buildTicketEmailFooter());
            helper.setText(html.toString(), true);

            for (Ticket ticket : tickets) {
                try {
                    byte[] qrBytes = qrCodeUtil.generateQrCode(ticket.getTicketCode(), 280, 280);
                    helper.addInline("qr-" + ticket.getTicketCode(),
                            new ByteArrayResource(qrBytes), "image/png");
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
                            background:#F1F0E8;overflow:hidden">
                  <div style="background:#8aa8b2;padding:24px 32px">
                    <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;
                               letter-spacing:1px">EventHub</h1>
                  </div>
                  <div style="padding:32px">
                    <p style="color:#171a1b;font-size:15px;margin:0 0 8px;font-weight:600">
                      Password Reset Request
                    </p>
                    <p style="color:#555;font-size:14px;margin:0 0 24px">
                      Use the code below to reset your password. It expires in 1 minute.
                    </p>
                    <div style="background:#fff;border:2px solid #B3C8CF;border-radius:8px;
                                padding:20px;text-align:center">
                      <span style="font-size:42px;font-weight:700;letter-spacing:14px;
                                   color:#8aa8b2;font-family:monospace">%s</span>
                    </div>
                    <p style="color:#aaa;font-size:12px;margin:20px 0 0;text-align:center">
                      If you did not request this, please ignore this email.
                    </p>
                  </div>
                </div>
                """.formatted(otp);
    }

    private String buildTicketEmailHeader(User user, Order order) {
        String eventName = order.getEvent().getEventName();
        String location = order.getEvent().getLocation() != null
                ? order.getEvent().getLocation()
                : "To be announced";
        String startDate = order.getEvent().getStartDate() != null
                ? order.getEvent().getStartDate()
                        .format(DateTimeFormatter.ofPattern("EEEE, dd/MM/yyyy  HH:mm"))
                : "To be announced";
        String userName = user.getFullName() != null ? user.getFullName() : user.getEmail();
        String orderCode = order.getOrderCode();
        String payment = order.getPaymentMethod() != null
                ? order.getPaymentMethod().name()
                : "N/A";

        return """
                <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;
                            background:#f7f7f7;overflow:hidden">

                  <!-- Top bar -->
                  <div style="background:#8aa8b2;padding:24px 32px">
                    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;
                               letter-spacing:1px">EventHub</h1>
                    <p style="color:rgba(255,255,255,0.85);margin:5px 0 0;font-size:13px">
                      Booking Confirmation
                    </p>
                  </div>

                  <!-- Greeting -->
                  <div style="padding:28px 32px 0">
                    <p style="color:#171a1b;font-size:16px;margin:0 0 6px">
                      Hi <strong>%s</strong>,
                    </p>
                    <p style="color:#555;font-size:14px;margin:0">
                      Your booking is confirmed. Here are your ticket details.
                    </p>
                  </div>

                  <!-- Event info card -->
                  <div style="margin:20px 32px;background:#fff;border-radius:8px;
                              border:1px solid #B3C8CF;border-top:4px solid #FF6B35;
                              overflow:hidden">
                    <div style="padding:20px 24px">
                      <h2 style="color:#171a1b;font-size:19px;font-weight:700;
                                 margin:0 0 18px">%s</h2>
                      <table style="width:100%%;border-collapse:collapse;font-size:14px">
                        <tr>
                          <td style="padding:5px 0;color:#888;width:90px">Date</td>
                          <td style="padding:5px 0;color:#171a1b;font-weight:600">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:5px 0;color:#888">Location</td>
                          <td style="padding:5px 0;color:#171a1b;font-weight:600">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:5px 0;color:#888">Order ID</td>
                          <td style="padding:5px 0;color:#8aa8b2;font-weight:700;
                                     font-family:monospace;font-size:15px">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:5px 0;color:#888">Payment</td>
                          <td style="padding:5px 0;color:#171a1b;font-weight:600">%s</td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <!-- Section label -->
                  <div style="padding:4px 32px 12px">
                    <p style="margin:0;font-size:11px;font-weight:700;color:#888;
                              text-transform:uppercase;letter-spacing:2px">Your Tickets</p>
                  </div>

                """.formatted(userName, eventName, startDate, location, orderCode, payment);
    }

    private String buildTicketBlock(Ticket ticket, String qrCid) {
        String ticketTypeName = ticket.getTicketType() != null
                ? ticket.getTicketType().getTicketName()
                : "Free Admission";
        String price = ticket.getPrice() != null
                && ticket.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0
                        ? String.format("%,.0f VND", ticket.getPrice())
                        : "Free";

        return """
                <div style="margin:0 32px 16px;background:#fff;border-radius:8px;
                            border:1px solid #B3C8CF;overflow:hidden">

                  <!-- Ticket header row -->
                  <div style="background:#F1F0E8;padding:11px 20px;
                              border-bottom:1px solid #B3C8CF">
                    <span style="font-size:15px;font-weight:700;color:#171a1b">%s</span>
                    <span style="float:right;font-size:15px;font-weight:700;color:#FF6B35">%s</span>
                  </div>

                  <!-- Ticket body: info left | QR right -->
                  <table style="width:100%%;border-collapse:collapse">
                    <tr>
                      <td style="padding:20px;vertical-align:middle">
                        <p style="margin:0 0 4px;font-size:11px;font-weight:700;
                                  color:#888;text-transform:uppercase;letter-spacing:1px">
                          Ticket Code
                        </p>
                        <p style="margin:0 0 18px;font-family:monospace;font-size:22px;
                                  font-weight:700;color:#8aa8b2;letter-spacing:3px">%s</p>
                        <p style="margin:0;font-size:13px;color:#555;line-height:1.7">
                          Show this QR code at the event entrance.<br>
                          One scan per ticket.
                        </p>
                      </td>
                      <td style="padding:16px 20px;vertical-align:middle;
                                 text-align:center;width:200px">
                        <img src="cid:%s" width="170" height="170" alt="QR Code"
                             style="display:block;margin:0 auto;
                                    border:3px solid #F1F0E8;border-radius:6px"/>
                        <p style="margin:8px 0 0;font-size:11px;color:#aaa;
                                  text-transform:uppercase;letter-spacing:1px">
                          Scan to check in
                        </p>
                      </td>
                    </tr>
                  </table>

                </div>
                """.formatted(ticketTypeName, price, ticket.getTicketCode(), qrCid);
    }

    private String buildTicketEmailFooter() {
        return """
                  <!-- Footer -->
                  <div style="padding:20px 32px 28px;text-align:center;
                              border-top:1px solid #e2e8f0;margin-top:4px">
                    <p style="margin:0 0 4px;font-size:13px;color:#555">
                      Need help? Contact
                      <a href="mailto:support@eventhub.com"
                         style="color:#8aa8b2;text-decoration:none;font-weight:600">
                        support@eventhub.com
                      </a>
                    </p>
                    <p style="margin:0;font-size:11px;color:#bbb">
                      © 2026 EventHub. All rights reserved.
                    </p>
                  </div>

                </div>
                """;
    }
}