package com.eventmanagement.backend.dto.response;

import lombok.*;

@Getter
@Builder
public class VerifyOtpResponse {
    private String resetToken;
}