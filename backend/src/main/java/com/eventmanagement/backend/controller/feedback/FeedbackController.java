package com.eventmanagement.backend.controller.feedback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.dto.response.FeedbackResponseDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.FeedbackDetailReponseDTO;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.service.CustomFormService;
import com.eventmanagement.backend.service.FeedbackService;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173",allowCredentials="true") 
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;
    private CustomFormRepository customFormRepository;
    private CustomFormService CustomFormService;
    private FeedbackService FeedbackService;
    //DI
    public FeedbackController(FeedbackRepository feedbackRepository, CustomFormRepository customFormRepository, CustomFormService customFormService, FeedbackService feedbackService) {
        this.feedbackRepository = feedbackRepository;
        this.customFormRepository = customFormRepository;
        this.CustomFormService = customFormService;
        this.FeedbackService = feedbackService;
    }



    @GetMapping("/events/{eventId}/feedback")
    public ResponseEntity<Map<String, Object>> getEventFeedbacks(@PathVariable UUID eventId) {

        List<FeedbackResponseDTO> feedbacks = feedbackRepository.findFeedbacksByEventId(eventId);
        
        Map<String, Object> response = new HashMap<>(); 
        response.put("feedbacks", feedbacks);
        

    
        return ResponseEntity.ok(response);
    }

    @PostMapping("/v1/events/{eventId}/forms")
    public ResponseEntity<CustomForm> createform(@PathVariable("eventId") UUID eventId, @RequestBody CustomFormRequestDTO form) {
        CustomForm savedForm = CustomFormService.saveCustomForm(eventId, form);
        return ResponseEntity.ok(savedForm);
    }
    
    @GetMapping("/v1/events/{eventId}/forms")
    public ResponseEntity<CustomForm> getForms(@PathVariable UUID eventId) {
        CustomForm form = CustomFormService.getFeedBackForm(eventId);
        if(form != null){
            return ResponseEntity.ok(form);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/v1/feedbacks/{feedbackId}")
    public ResponseEntity<FeedbackDetailReponseDTO> getFeedbackDetail(@PathVariable UUID feedbackId) {
        return ResponseEntity.ok(FeedbackService.getFeedbackDetail(feedbackId));

}
}