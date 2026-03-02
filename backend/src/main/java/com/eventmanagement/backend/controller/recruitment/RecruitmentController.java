package com.eventmanagement.backend.controller.recruitment;


import com.eventmanagement.backend.dto.response.attendee.ApplicationFormResponse;
import com.eventmanagement.backend.dto.response.attendee.RecruitmentResponse;
import com.eventmanagement.backend.service.ApplicationFormService;
import com.eventmanagement.backend.service.CloudinaryService;
import com.eventmanagement.backend.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/recruitments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;
    private final ApplicationFormService applicationFormService;
    private final CloudinaryService cloudinaryService;

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

    @GetMapping("/{eventSlug}/apply-staff")
    public ResponseEntity<ApplicationFormResponse> getApplicationForm(@PathVariable String eventSlug) {
        ApplicationFormResponse response = applicationFormService.getFormForAttendee(eventSlug);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/{eventSlug}/apply-staff", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitApplication(
            @PathVariable String eventSlug,
            @RequestParam("recruitmentId") UUID recruitmentId,
            @RequestParam("userId") UUID userId,
            @RequestParam("answers") String answersJson,
            @RequestParam("files") MultipartFile cv
    ) {
        try {
            applicationFormService.submitApplication(recruitmentId, userId, answersJson, cv);
            return ResponseEntity.ok().body("Success!!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
