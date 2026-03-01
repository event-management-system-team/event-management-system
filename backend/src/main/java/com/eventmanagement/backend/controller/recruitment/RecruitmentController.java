package com.eventmanagement.backend.controller.recruitment;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.response.attendee.RecruitmentResponse;
import com.eventmanagement.backend.service.RecruitmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/recruitments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping("/recent")
    public ResponseEntity<List<RecruitmentResponse>> getRecentRecruitment() {
        List<RecruitmentResponse> recruitments = recruitmentService.getRecentRecruitments();
        return ResponseEntity.ok(recruitments);
    }
}
