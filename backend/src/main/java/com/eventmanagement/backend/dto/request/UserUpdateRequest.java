package com.eventmanagement.backend.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String phone;
}
