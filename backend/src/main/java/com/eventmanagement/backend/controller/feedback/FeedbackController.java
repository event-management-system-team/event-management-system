package com.eventmanagement.backend.controller.feedback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.response.FeedbackResponseDTO;
import com.eventmanagement.backend.repository.FeedbackRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // CỰC KỲ QUAN TRỌNG: Cho phép React gọi API mà không bị chặn lỗi CORS
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping("/events/{eventId}/feedbacks")
    public ResponseEntity<Map<String, Object>> getEventFeedbacks(@PathVariable String eventId) {
        // 1. Lấy danh sách feedback từ Database
        List<FeedbackResponseDTO> feedbacks = feedbackRepository.findFeedbacksByEventId(eventId);
        
        // 2. Gom thành cục JSON giống hệt cấu trúc React đang chờ
        Map<String, Object> response = new HashMap<>();
        response.put("eventName", "BridgeFest 2026"); // Tên sự kiện (Tạm thời hardcode, sau này bạn có thể query thêm từ bảng events)
        response.put("feedbacks", feedbacks);

        // 3. Trả về cho Frontend
        return ResponseEntity.ok(response);
    }
}