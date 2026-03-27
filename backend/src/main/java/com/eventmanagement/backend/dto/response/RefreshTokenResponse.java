package com.eventmanagement.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RefreshTokenResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresIn; // access token TTL in milliseconds
    private LoginResponse.UserInfor user;
}
