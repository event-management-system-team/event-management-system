package com.eventmanagement.backend.controller.feedback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.request.SubmitFeedbackRequest;
import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDetailDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Feedback;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.service.attendee.RecruitmentService;
import com.eventmanagement.backend.service.organizer.CustomFormService;
import com.eventmanagement.backend.service.organizer.FeedbackService;
import com.eventmanagement.backend.service.organizer.RecruitmentServiceOrganizer;




@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials="true") 
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final CustomFormRepository customFormRepository;
    private final CustomFormService customFormService; 
    private final FeedbackService feedbackService; 
    private final RecruitmentService recruitmentService;
    private final RecruitmentServiceOrganizer recruitmentServiceOrganizer;
    private final EventRepository eventRepository;

     // DI qua constructor

    public FeedbackController(FeedbackRepository feedbackRepository, 
                              CustomFormRepository customFormRepository, 
                              CustomFormService customFormService, 
                              FeedbackService feedbackService,
                              RecruitmentService recruitmentService,
                              RecruitmentServiceOrganizer recruitmentServiceOrganizer,
                              EventRepository eventRepository) {
        this.feedbackRepository = feedbackRepository;
        this.customFormRepository = customFormRepository;
        this.customFormService = customFormService;
        this.feedbackService = feedbackService;
        this.recruitmentService = recruitmentService;
        this.recruitmentServiceOrganizer = recruitmentServiceOrganizer;
        this.eventRepository = eventRepository;
    }

    @GetMapping("/events/{eventId}/feedback")
    public ResponseEntity<Map<String, Object>> getEventFeedbacks(@PathVariable UUID eventId) {
        List<FeedbackResponseDTO> feedbacks = feedbackRepository.findFeedbacksByEventId(eventId);
        
        if (feedbacks == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện");
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("feedbacks", feedbacks);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/events/{eventId}/forms")
    public ResponseEntity<?> createForm(@PathVariable("eventId") UUID eventId, @RequestBody CustomFormRequestDTO form) {
        try {
            CustomForm savedForm = customFormService.saveCustomForm(eventId, form);
            return ResponseEntity.ok(savedForm);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
    
    @GetMapping("/feedbacks/{feedbackId}")
    public ResponseEntity<FeedbackDetailResponseDTO> getFeedbackDetail(@PathVariable UUID feedbackId) {
        return ResponseEntity.ok(feedbackService.getFeedbackDetail(feedbackId));
    }
    @GetMapping("event/recruitments/{recruitmentId}")
    public ResponseEntity<RecruitmentDetailDTO> getRecruitmentDetail(@PathVariable UUID recruitmentId) {
        RecruitmentDetailDTO detail = recruitmentServiceOrganizer.getRecruitmentDetail(recruitmentId);
        return ResponseEntity.ok(detail);

    }

    @GetMapping("/events/{eventId}/forms")
    public ResponseEntity<?> getEventForm(
    @PathVariable("eventId") UUID eventId,
    @RequestParam(value = "type", defaultValue = "FEEDBACK") String typeStr 
    ) {
    try {
        FormType type = FormType.valueOf(typeStr.toUpperCase());
        CustomForm form = customFormService.getFormByType(eventId, type); 
        if (form == null) {
            return ResponseEntity.ok(Map.of("message", "Chưa có form nào được tạo"));
        }
        return ResponseEntity.ok(form);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loại form không hợp lệ (formType)");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
    }
}

@PostMapping("feedbacks/events/{eventId}")
@PreAuthorize("hasRole('ATTENDEE')")
    public ResponseEntity<?> submitFeedback(
            @PathVariable UUID eventId,
            @RequestBody SubmitFeedbackRequest request) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUserEmail = currentUser.getEmail();
            Feedback savedFeedback = feedbackService.createFeedback(eventId, currentUserEmail, request);
            
            return ResponseEntity.ok(Map.of(
                "message", "Cảm ơn bạn đã gửi đánh giá!",
                "feedbackId", savedFeedback.getId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Lỗi server nội bộ: " + e.getMessage()));
        }
    }

    @GetMapping("/events/ids/{eventId}")
    public ResponseEntity<?> getEventInfo(@PathVariable UUID eventId) {
        try {
            Map<String, Object> eventInfo = feedbackService.getEventInfoForFeedback(eventId);
            return ResponseEntity.ok(eventInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}
