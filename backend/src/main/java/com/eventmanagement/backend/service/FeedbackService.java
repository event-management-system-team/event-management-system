package com.eventmanagement.backend.service;

import java.lang.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.dto.response.FeedbackResponseDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Feedback;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.FeedbackDetailReponseDTO;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.repository.UserRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    private UserRepository userRepository;
    private EventRepository eventRepository;
    private FeedbackRepository FeedbackRepository;
    private CustomFormRepository CustomFormRepository;
    //DI
    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository, EventRepository eventRepository
    , FeedbackRepository FeedbackRepository, CustomFormRepository CustomFormRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.FeedbackRepository = FeedbackRepository;
        this.CustomFormRepository = CustomFormRepository;
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
        Feedback feedback =  FeedbackRepository.findById(feedbackId).orElseThrow(() -> new RuntimeException("Feedback not found"));
        User user = feedback.getUser();
        Event event = feedback.getEvent();
        if (user == null) throw new RuntimeException("Bài đánh giá này không có dữ liệu người dùng (User is null)!");
        if (event == null) throw new RuntimeException("Bài đánh giá này không thuộc sự kiện nào (Event is null)!");

        CustomForm form = CustomFormRepository.findByEventId(event.getEventId()).orElse(null);
        
        // 2. Chuẩn bị biến formSchema
        List<Map<String, Object>> formSchema = null;

        // 🔥 THÊM ÁO GIÁP Ở ĐÂY: Chỉ khi nào tìm thấy form thì mới lấy Schema ra!
        if (form != null) {
            formSchema = form.getFormSchema(); 
        }

        // Tạo một mảng mới để chứa danh sách câu trả lời ĐÃ ĐƯỢC GHÉP TÊN CÂU HỎI
        List<Map<String, Object>> enrichedDetails = new ArrayList<>();
        // Nếu bảng feedback có dữ liệu câu trả lời
        if (feedback.getFeedbackData() != null) {
            for (Map<String, Object> answerItem : feedback.getFeedbackData()) {
                
                // Tạo một Map mới copy từ DB ra (Để tránh Hibernate tự động update ngược vào Database)
                Map<String, Object> enrichedItem = new HashMap<>(answerItem);
                
                String fieldId = (String) enrichedItem.get("field_id");
                
                // Tiêu đề mặc định nếu không tìm thấy
                String questionLabel = "Câu hỏi " + fieldId; 

                // Chạy vòng lặp đi dò trong formSchema để tìm nội dung câu hỏi
                if (formSchema != null) {
                    for (Map<String, Object> questionDef : formSchema) {
                        // So khớp id của câu hỏi trong Form với field_id trong Feedback
                        if (fieldId.equals(questionDef.get("id"))) { 
                            // TODO 2: Tùy lúc làm FormBuilder bạn lưu tiêu đề là 'label', 'title' hay 'question'
                            questionLabel = (String) questionDef.get("label"); 
                            break; // Tìm thấy rồi thì thoát vòng lặp con
                        }
                    }
                }
                
                // Nhét thêm cái tên câu hỏi xịn xò vào Map
                enrichedItem.put("question", questionLabel);
                
                // Thêm vào danh sách mới
                enrichedDetails.add(enrichedItem);
            }
        }

        //feedback
        FeedbackDetailReponseDTO responseDTO = new FeedbackDetailReponseDTO();
        responseDTO.setEventName(event.getEventName());
        responseDTO.setSubmittedAt(event.getCreatedAt());

        //user
        FeedbackDetailReponseDTO.AttendeeInfor attendeeInfor = new FeedbackDetailReponseDTO.AttendeeInfor();
        attendeeInfor.setFullName(user.getFullName());
        attendeeInfor.setEmail(user.getEmail());
        attendeeInfor.setAvatar(user.getAvatarUrl());
        attendeeInfor.setPhoneNumber(user.getPhone());
        responseDTO.setAttendeeInfor(attendeeInfor);

        //feedback
        FeedbackDetailReponseDTO.FeedbackResponse feedbackResponse = new FeedbackDetailReponseDTO.FeedbackResponse();
        feedbackResponse.setOverallRating(feedback.getRating());
        feedbackResponse.setComment(feedback.getComment());
        feedbackResponse.setDetail(enrichedDetails);
        responseDTO.setFeedbackResponse(feedbackResponse);

        return responseDTO;
    }

}
