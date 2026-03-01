package com.eventmanagement.backend.controller.recruitment;


import com.eventmanagement.backend.dto.response.attendee.RecruitmentResponse;
import com.eventmanagement.backend.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/recruitments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping("/recent")
    public ResponseEntity<List<RecruitmentResponse>> getRecentRecruitment() {
        List<RecruitmentResponse> recruitments = recruitmentService.getRecentRecruitments();
        return ResponseEntity.ok(recruitments);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecruitmentResponse>> searchRecruitment(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate deadline,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RecruitmentResponse> responses = recruitmentService.searchRecruitments(keyword, location, deadline, page, size);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{eventSlug}")
    public ResponseEntity<RecruitmentResponse> getRecruitmentByEvent_EventSlug(@PathVariable("eventSlug") String eventSlug) {
        RecruitmentResponse response = recruitmentService.getRecruitmentByEventSlug(eventSlug);
        return ResponseEntity.ok(response);
    }
}
