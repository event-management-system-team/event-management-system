package com.eventmanagement.backend.dto.request;

import com.eventmanagement.backend.model.StaffApplication.ApplicationStatus;

import lombok.Data;

@Data
public class UpdateApplicationStatusRequest {
    private ApplicationStatus status;
}