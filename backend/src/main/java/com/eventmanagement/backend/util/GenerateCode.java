package com.eventmanagement.backend.util;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class GenerateCode {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateOrderCode() {
        String date = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = generateRandomString(6);
        return "ORD-" + date + "-" + random;
    }

    public String generateTicketCode() {
        String date = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = generateRandomString(6);
        return "TKT-" + date + "-" + random;
    }

    public String generateQrCode(String ticketCode) {
        String random = generateRandomString(4);
        return "QR-" + ticketCode + "-" + random;
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(
                    RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

}
