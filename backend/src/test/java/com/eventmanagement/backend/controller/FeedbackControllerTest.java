package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.controller.feedback.FeedbackController;
import com.eventmanagement.backend.service.FeedbackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FeedbackController.class)
@AutoConfigureMockMvc(addFilters = false) // Tắt security giống mẫu Auth của bạn
public class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedbackService feedbackService;

    @Test
    void testGetEventFeedbacks_Controller_Success() throws Exception {
        // GIVEN
        UUID eventId = UUID.randomUUID();
        when(feedbackService.getFeedbackListData(eventId)).thenReturn(new HashMap<>());

        // WHEN & THEN
        // Spring sẽ tự hiểu chuỗi String này là UUID khi vào Controller
        mockMvc.perform(get("/api/v1/events/" + eventId.toString() + "/feedbacks")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}