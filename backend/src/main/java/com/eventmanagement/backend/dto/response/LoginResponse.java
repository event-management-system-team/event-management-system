package com.eventmanagement.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.eventmanagement.backend.constants.*;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserInfor user;

    @Data
    @Builder
    public static class UserInfor {
        private UUID user_id;
        private String email;
        private String full_name;
        private String phone;
        private String avatar_url;
        private Role role;
        private Status status;
        private String google_id;
        private Boolean email_verified;
        private LocalDateTime last_login_at;
        private LocalDateTime created_at;
        private LocalDateTime updated_at;
    }
}
