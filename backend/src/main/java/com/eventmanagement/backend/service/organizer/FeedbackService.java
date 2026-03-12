package com.eventmanagement.backend.service.organizer;

import java.lang.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.dto.request.SubmitFeedbackRequest;
import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Feedback;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.repository.TicketTypeRepository;
import com.eventmanagement.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    @Autowired
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final CustomFormRepository customFormRepository;
    private final TicketTypeRepository ticketRepository;


 private  FeedbackResponseDTO feedbackResponseDTO;
    public List<FeedbackResponseDTO> getFeedbacksByEvent(UUID eventId) {
        return feedbackRepository.findFeedbacksByEventId(eventId);
    }
    public Map<String, Object> getFeedbackListData(UUID eventId) {
        List<FeedbackResponseDTO> feedbacks = feedbackRepository.findFeedbacksByEventId(eventId);
        Map<String, Object> response = new HashMap<>();
        response.put("feedbacks", feedbacks);
        return response;
    }

   public FeedbackDetailResponseDTO getFeedbackDetail(UUID feedbackId) {
    Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
    
    User user = feedback.getUser();
    Event event = feedback.getEvent();
    
    if (user == null) throw new RuntimeException("Bài đánh giá này không có dữ liệu người dùng (User is null)!");
    if (event == null) throw new RuntimeException("Bài đánh giá này không thuộc sự kiện nào (Event is null)!");

    CustomForm form = customFormRepository.findByEvent_EventId(event.getEventId()).orElse(null);
    List<Map<String, Object>> formSchema = (form != null) ? form.getFormSchema() : null;
    List<Map<String, Object>> enrichedDetails = new ArrayList<>();
    if (feedback.getFeedbackData() != null) {
        for (Map<String, Object> answerItem : feedback.getFeedbackData()) {
            Map<String, Object> enrichedItem = new HashMap<>(answerItem);
            String fieldId = (String) enrichedItem.get("field_id");
            String questionLabel = (String) enrichedItem.get("question");
            if (questionLabel == null) {
                questionLabel = (fieldId != null) ? "Câu hỏi " + fieldId : "Câu hỏi không xác định";
            }
            if (formSchema != null && fieldId != null) {
                for (Map<String, Object> questionDef : formSchema) {
                    if (fieldId.equals(questionDef.get("field_id"))) { 
                        String schemaQuestion = (String) questionDef.get("question"); 
                        if (schemaQuestion != null) {
                            questionLabel = schemaQuestion;
                        }
                        break; 
                    }
                }
            }
            enrichedItem.put("question", questionLabel);
            enrichedDetails.add(enrichedItem);
        }
    }
    FeedbackDetailResponseDTO responseDTO = FeedbackDetailResponseDTO.builder()
            .eventName(event.getEventName())
            .submittedAt(event.getCreatedAt())
            .build();

    FeedbackDetailResponseDTO.AttendeeInfor attendeeInfor = new FeedbackDetailResponseDTO.AttendeeInfor();
    attendeeInfor.setFullName(user.getFullName());
    attendeeInfor.setEmail(user.getEmail());
    attendeeInfor.setAvatar(user.getAvatarUrl());
    attendeeInfor.setPhoneNumber(user.getPhone());
    responseDTO.setAttendeeInfor(attendeeInfor);

    FeedbackDetailResponseDTO.FeedbackResponse feedbackResponse = new FeedbackDetailResponseDTO.FeedbackResponse();
    feedbackResponse.setOverallRating(feedback.getRating());
    feedbackResponse.setComment(feedback.getComment());
    feedbackResponse.setDetail(enrichedDetails);
    responseDTO.setFeedbackResponse(feedbackResponse);
    return responseDTO;
}

    @Transactional
    public Feedback createFeedback(UUID eventId, String email, SubmitFeedbackRequest request) {
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại!"));
                
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại hoặc phiên đăng nhập không hợp lệ!"));

        UUID userId = user.getUserId(); 

        if (event.getStartDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Sự kiện chưa diễn ra, không thể gửi đánh giá!");
        }

        boolean alreadySubmitted = feedbackRepository.existsByEvent_EventIdAndUser_UserId(eventId, userId);
        if (alreadySubmitted) {
            throw new RuntimeException("Bạn đã gửi đánh giá cho sự kiện này rồi!");
        }
        
        Feedback feedback = new Feedback();
        feedback.setEvent(event);
        feedback.setUser(user);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setFeedbackData(request.getFeedbackData());
        return feedbackRepository.save(feedback);
    }

    public Map<String, Object> getEventInfoForFeedback(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện!"));
        Map<String, Object> eventInfo = new HashMap<>();
        eventInfo.put("eventId", event.getEventId());
        eventInfo.put("eventName", event.getEventName());
        eventInfo.put("startDate", event.getStartDate());
        eventInfo.put("endDate", event.getEndDate());
        eventInfo.put("bannerUrl", event.getBannerUrl()); 

        return eventInfo;
    }
}
