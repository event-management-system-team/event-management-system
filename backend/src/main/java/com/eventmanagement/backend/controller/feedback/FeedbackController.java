package com.eventmanagement.backend.controller.feedback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailReponseDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDetailDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.service.CustomFormService;
import com.eventmanagement.backend.service.FeedbackService;
import com.eventmanagement.backend.service.RecruitmentService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials="true") 
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final CustomFormRepository customFormRepository;
    private final CustomFormService customFormService; 
    private final FeedbackService feedbackService; 
    private final RecruitmentService recruitmentService;
    

    public FeedbackController(FeedbackRepository feedbackRepository, 
                              CustomFormRepository customFormRepository, 
                              CustomFormService customFormService, 
                              FeedbackService feedbackService,
                              RecruitmentService recruitmentService) {
        this.feedbackRepository = feedbackRepository;
        this.customFormRepository = customFormRepository;
        this.customFormService = customFormService;
        this.feedbackService = feedbackService;
        this.recruitmentService = recruitmentService;
    }

    @GetMapping("/events/{eventId}/feedback")
    public ResponseEntity<Map<String, Object>> getEventFeedbacks(@PathVariable UUID eventId) {
        List<FeedbackResponseDTO> feedbacks = feedbackRepository.findFeedbacksByEventId(eventId);
        Map<String, Object> response = new HashMap<>(); 
        response.put("feedbacks", feedbacks);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/v1/events/{eventId}/forms")
    public ResponseEntity<?> createForm(@PathVariable("eventId") UUID eventId, @RequestBody CustomFormRequestDTO form) {
        try {
            CustomForm savedForm = customFormService.saveCustomForm(eventId, form);
            return ResponseEntity.ok(savedForm);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
    

    // @GetMapping("/v1/events/{eventId}/forms")
    // public ResponseEntity<?> getForms(
    //         @PathVariable UUID eventId,
    //         @RequestParam(defaultValue = "FEEDBACK") String type // Tự động hứng ?type=... từ URL
    // ) {
    //     CustomForm form = customFormService.getFormByType(eventId, type.toUpperCase());
        
    //     if (form != null) {
    //         return ResponseEntity.ok(form);
    //     }
    //             return ResponseEntity.noContent().build();
    // }

    @GetMapping("/v1/feedbacks/{feedbackId}")
    public ResponseEntity<FeedbackDetailReponseDTO> getFeedbackDetail(@PathVariable UUID feedbackId) {
        return ResponseEntity.ok(feedbackService.getFeedbackDetail(feedbackId));
    }
    @GetMapping("/v1/recruitments/{recruitmentId}")
    public ResponseEntity<RecruitmentDetailDTO> getRecruitmentDetail(@PathVariable UUID recruitmentId) {
        RecruitmentDetailDTO detail = recruitmentService.getRecruitmentDetail(recruitmentId);
        return ResponseEntity.ok(detail);
    }
}