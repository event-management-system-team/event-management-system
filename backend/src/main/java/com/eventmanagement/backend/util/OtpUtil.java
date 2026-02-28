package com.eventmanagement.backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class OtpUtil {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String generateOtp() {
        int otp = 100_000 + RANDOM.nextInt(900_000);
        return String.valueOf(otp);
    }

    public String hashOtp(String rawOtp) {
        return encoder.encode(rawOtp);
    }

    public boolean verifyOtp(String rawOtp, String hashedOtp) {
        return encoder.matches(rawOtp, hashedOtp);
    }
}