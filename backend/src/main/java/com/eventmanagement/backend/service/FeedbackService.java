package com.eventmanagement.backend.service;

import java.lang.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailReponseDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Feedback;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.repository.UserRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    private UserRepository userRepository;
    private EventRepository eventRepository;
    private  FeedbackResponseDTO feedbackResponseDTO;
    private CustomFormRepository customFormRepository;
    //DI
    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository, EventRepository eventRepository
    , FeedbackRepository FeedbackRepository, CustomFormRepository CustomFormRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.customFormRepository = customFormRepository;
    }

    public List<FeedbackResponseDTO> getFeedbacksByEvent(UUID eventId) {
        return feedbackRepository.findFeedbacksByEventId(eventId);
    }
    public Map<String, Object> getFeedbackListData(UUID eventId) {
        List<FeedbackResponseDTO> feedbacks = feedbackRepository.findFeedbacksByEventId(eventId);
        
        Map<String, Object> response = new HashMap<>();
        // Tên sự kiện có thể lấy từ bảng Event, hiện tại mình tạm để cố định
        response.put("eventName", "BridgeFest 2026"); 
        response.put("feedbacks", feedbacks);
        
        return response;
    }

    public FeedbackDetailReponseDTO getFeedbackDetail(UUID feedbackId) {
        Feedback feedback =  feedbackRepository.findById(feedbackId).orElseThrow(() -> new RuntimeException("Feedback not found"));
        User user = feedback.getUser();
        Event event = feedback.getEvent();
        if (user == null) throw new RuntimeException("Bài đánh giá này không có dữ liệu người dùng (User is null)!");
        if (event == null) throw new RuntimeException("Bài đánh giá này không thuộc sự kiện nào (Event is null)!");

        CustomForm form = customFormRepository.findByEventId(event.getEventId()).orElse(null);
        
      
        List<Map<String, Object>> formSchema = null;


        if (form != null) {
            formSchema = form.getFormSchema(); 
        }


        List<Map<String, Object>> enrichedDetails = new ArrayList<>();
        if (feedback.getFeedbackData() != null) {
            for (Map<String, Object> answerItem : feedback.getFeedbackData()) {
                
                Map<String, Object> enrichedItem = new HashMap<>(answerItem);
                
                String fieldId = (String) enrichedItem.get("field_id");
                
    
                String questionLabel = "Câu hỏi " + fieldId; 

                if (formSchema != null) {
                    for (Map<String, Object> questionDef : formSchema) {
                        if (fieldId.equals(questionDef.get("id"))) { 
                            questionLabel = (String) questionDef.get("label"); 
                            break; 
                        }
                    }
                }
                
             
                enrichedItem.put("question", questionLabel);
                
                
                enrichedDetails.add(enrichedItem);
            }
        }

 
        FeedbackDetailReponseDTO responseDTO = FeedbackDetailReponseDTO.builder()
                .eventName(event.getEventName())
                .submittedAt(event.getCreatedAt())
                .build();

 
        FeedbackDetailReponseDTO.AttendeeInfor attendeeInfor = new FeedbackDetailReponseDTO.AttendeeInfor();
        attendeeInfor.setFullName(user.getFullName());
        attendeeInfor.setEmail(user.getEmail());
        attendeeInfor.setAvatar(user.getAvatarUrl());
        attendeeInfor.setPhoneNumber(user.getPhone());
        responseDTO.setAttendeeInfor(attendeeInfor);

 
        FeedbackDetailReponseDTO.FeedbackResponse feedbackResponse = new FeedbackDetailReponseDTO.FeedbackResponse();
        feedbackResponse.setOverallRating(feedback.getRating());
        feedbackResponse.setComment(feedback.getComment());
        feedbackResponse.setDetail(enrichedDetails);
        responseDTO.setFeedbackResponse(feedbackResponse);

        return responseDTO;
    }

}
