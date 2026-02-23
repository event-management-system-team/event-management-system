package com.eventmanagement.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, message = "Full name must be at least 2 characters long")
    private String fullName;

    @Size(min = 10, max = 10, message = "Phone number must be 10 digits long")
    @Pattern(regexp = "^[0-9]+$", message = "Phone number must contain only digits")
    private String phone;

    private String avatarUrl;
}
