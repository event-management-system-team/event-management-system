package com.eventmanagement.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.dto.response.FeedbackResponseDTO;
import com.eventmanagement.backend.repository.FeedbackRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<FeedbackResponseDTO> getFeedbacksByEvent(UUID eventId) {
        return feedbackRepository.findFeedbacksByEventId(eventId.toString());
    }
}