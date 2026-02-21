package com.eventmanagement.backend.dto.request;

import lombok.Data;

@Data
public class CreateOrganizerRequest {
    private String email;
    private String fullName;
    private String password;
    private String phone;
}
