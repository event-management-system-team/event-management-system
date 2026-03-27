package com.eventmanagement.backend.controller.feedback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.request.SubmitFeedbackRequest;
import com.eventmanagement.backend.dto.response.admin.EventResponse;
import com.eventmanagement.backend.dto.response.organizer.FeedbackAnalyticsResponse;
import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackItemResponse;
import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDetailDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Feedback;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.service.attendee.RecruitmentService;
import com.eventmanagement.backend.service.organizer.CustomFormService;
import com.eventmanagement.backend.service.organizer.FeedbackService;
import com.eventmanagement.backend.service.organizer.RecruitmentServiceOrganizer;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final CustomFormRepository customFormRepository;
    private final CustomFormService customFormService;
    private final FeedbackService feedbackService;
    private final RecruitmentService recruitmentService;
    private final RecruitmentServiceOrganizer recruitmentServiceOrganizer;

    // DI qua constructor

    public FeedbackController(FeedbackRepository feedbackRepository,
            CustomFormRepository customFormRepository,
            CustomFormService customFormService,
            FeedbackService feedbackService,
            RecruitmentService recruitmentService,
            RecruitmentServiceOrganizer recruitmentServiceOrganizer) {
        this.feedbackRepository = feedbackRepository;
        this.customFormRepository = customFormRepository;
        this.customFormService = customFormService;
        this.feedbackService = feedbackService;
        this.recruitmentService = recruitmentService;
        this.recruitmentServiceOrganizer = recruitmentServiceOrganizer;
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

    @GetMapping("/events/{eventId}/analytics")
    public ResponseEntity<FeedbackAnalyticsResponse> getFeedbackAnalytics(@PathVariable UUID eventId) {
        return ResponseEntity.ok(feedbackService.getFeedbackAnalytics(eventId));
    }

    @GetMapping("/events/{eventId}/reviews")
    public ResponseEntity<Page<FeedbackItemResponse>> getFeedbackReviews(
            @PathVariable UUID eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(feedbackService.getFeedbackReviews(eventId, pageable));
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
            @RequestParam(value = "type", defaultValue = "FEEDBACK") String typeStr) {
        try {
            FormType type = FormType.valueOf(typeStr.toUpperCase());
            CustomForm form = customFormService.getFormByType(eventId, type);
            if (form == null) {
                // Try native query fallback (form might exist but entity deserialization failed silently)
                return tryNativeQueryFallback(eventId, typeStr);
            }
            return ResponseEntity.ok(form);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loại form không hợp lệ (formType)");
        } catch (Exception e) {
            // Entity deserialization failed - try native query fallback
            System.err.println("[FeedbackController] Entity deserialization failed for eventId=" + eventId + ", type=" + typeStr + ": " + e.getMessage());
            return tryNativeQueryFallback(eventId, typeStr);
        }
    }

    private ResponseEntity<?> tryNativeQueryFallback(UUID eventId, String typeStr) {
        try {
            List<Object[]> rawList = customFormRepository.findRawFormByEventIdAndType(eventId, typeStr.toUpperCase());
            if (!rawList.isEmpty()) {
                Object[] row = rawList.get(0);
                Map<String, Object> result = new HashMap<>();
                result.put("formId", row[0] != null ? row[0].toString() : null);
                result.put("formName", row[1] != null ? row[1].toString() : null);
                result.put("formType", row[2] != null ? row[2].toString() : null);
                String rawSchema = row[3] != null ? row[3].toString() : null;
                if (rawSchema != null) {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    Object parsedSchema = mapper.readValue(rawSchema, Object.class);
                    // If schema is {"fields": [...]}, extract the fields array
                    if (parsedSchema instanceof java.util.Map) {
                        @SuppressWarnings("unchecked")
                        java.util.Map<String, Object> schemaMap = (java.util.Map<String, Object>) parsedSchema;
                        if (schemaMap.containsKey("fields")) {
                            parsedSchema = schemaMap.get("fields");
                        }
                    }
                    result.put("formSchema", parsedSchema);
                }
                result.put("active", row[4] != null ? (Boolean) row[4] : false);
                result.put("createdAt", row[5] != null ? row[5].toString() : null);
                result.put("updatedAt", row[6] != null ? row[6].toString() : null);
                result.put("deadline", row[7] != null ? row[7].toString() : null);
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.ok(Map.of("message", "Chưa có form nào được tạo"));
        } catch (Exception fallbackEx) {
            System.err.println("[FeedbackController] Native query fallback also failed: " + fallbackEx.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + fallbackEx.getMessage());
        }
    }

    @PostMapping("feedbacks/events/{eventId}")
    @PreAuthorize("hasRole('ATTENDEE')")
    public ResponseEntity<?> submitFeedback(
            @PathVariable UUID eventId,
            @RequestBody SubmitFeedbackRequest request) {
        try {
            // 2. FIX LỖI EMAIL: Lấy nguyên cái Object User ra từ SecurityContext
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // Rút email chuẩn từ Object đó ra
            String currentUserEmail = currentUser.getEmail();
            // Truyền email này xuống Service thay vì truyền ID
            Feedback savedFeedback = feedbackService.createFeedback(eventId, currentUserEmail, request);

            return ResponseEntity.ok(Map.of(
                    "message", "Cảm ơn bạn đã gửi đánh giá!",
                    "feedbackId", savedFeedback.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi server nội bộ: " + e.getMessage()));
        }
    }

    @GetMapping("/events/ids/{eventId}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable("eventId") UUID eventId) {
        EventResponse event = feedbackService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/feedbacks/{feedbackId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> deleteFeedback(@PathVariable UUID feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error deleting feedback: " + e.getMessage()));
        }
    }
}