package com.eventmanagement.backend.service.organizer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailResponseDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Feedback;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private CustomFormRepository customFormRepository;

    @InjectMocks
    private FeedbackService feedbackService;

    private UUID feedbackId;
    private UUID eventId;
    private Event mockEvent;
    private User mockUser;
    private Feedback mockFeedback;

    @BeforeEach
    void setUp() {
        feedbackId = UUID.randomUUID();
        eventId = UUID.randomUUID();
        mockUser = new User();
        mockUser.setFullName("Nguyen Van A");
        mockUser.setEmail("nva@gmail.com");
        mockEvent = new Event();
        mockEvent.setEventId(eventId);
        mockEvent.setEventName("Sự kiện Test");
        mockEvent.setCreatedAt(LocalDateTime.now());

        mockFeedback = new Feedback();
        mockFeedback.setUser(mockUser);
        mockFeedback.setEvent(mockEvent);
        mockFeedback.setRating(5);
        mockFeedback.setComment("Sự kiện rất tuyệt!");
    }


    @Test
    void testGetFeedbackDetail_Success() {
        List<Map<String, Object>> feedbackData = new ArrayList<>();
        Map<String, Object> answer1 = new HashMap<>();
        answer1.put("field_id", "question_1");
        answer1.put("answer", "Rất hài lòng");
        feedbackData.add(answer1);
        mockFeedback.setFeedbackData(feedbackData);

        CustomForm mockForm = new CustomForm();
        List<Map<String, Object>> formSchema = new ArrayList<>();
        Map<String, Object> schemaItem1 = new HashMap<>();
        schemaItem1.put("field_id", "question_1");
        schemaItem1.put("question", "Bạn đánh giá thế nào về MC?");
        formSchema.add(schemaItem1);
        mockForm.setFormSchema(formSchema);

        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.of(mockFeedback));
        when(customFormRepository.findByEvent_EventId(eventId)).thenReturn(Optional.of(mockForm));

        FeedbackDetailResponseDTO result = feedbackService.getFeedbackDetail(feedbackId);

        assertNotNull(result);
        assertEquals("Sự kiện Test", result.getEventName());
        assertEquals("Nguyen Van A", result.getAttendeeInfor().getFullName());
        assertEquals(5, result.getFeedbackResponse().getOverallRating());
        
        List<Map<String, Object>> details = result.getFeedbackResponse().getDetail();
        assertEquals(1, details.size());
        assertEquals("Bạn đánh giá thế nào về MC?", details.get(0).get("question"));
        assertEquals("Rất hài lòng", details.get(0).get("answer"));
    }


    @Test
    void testGetFeedbackDetail_NotFound_ThrowsException() {
        
        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            feedbackService.getFeedbackDetail(feedbackId);
        });
        assertEquals("Feedback not found", exception.getMessage());
    }


    @Test
    void testGetFeedbackDetail_UserNull_ThrowsException() {
        mockFeedback.setUser(null);
        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.of(mockFeedback));
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            feedbackService.getFeedbackDetail(feedbackId);
        });
        assertEquals("Bài đánh giá này không có dữ liệu người dùng (User is null)!", exception.getMessage());
    }
}