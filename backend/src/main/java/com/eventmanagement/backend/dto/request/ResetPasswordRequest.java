package com.eventmanagement.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    @NotBlank(message = "Token is required")
    private String resetToken;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).*$", message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}