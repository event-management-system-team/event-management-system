package com.eventmanagement.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.response.FeedbackResponse;
import com.eventmanagement.backend.service.FeedbackService;

@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = "*") // Quan trọng: Để Frontend gọi không bị chặn
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/{eventId}/feedbacks")
    public ResponseEntity<List<FeedbackResponse>> getEventFeedbacks(@PathVariable UUID eventId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByEvent(eventId));
    }
}