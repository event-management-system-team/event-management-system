package com.eventmanagement.backend.controller.organizer;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.eventmanagement.backend.controller.feedback.FeedbackController;
import com.eventmanagement.backend.dto.response.organizer.FeedbackDetailResponseDTO;
import com.eventmanagement.backend.dto.response.organizer.FeedbackResponseDTO;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.FeedbackRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.service.attendee.RecruitmentService;
import com.eventmanagement.backend.service.organizer.CustomFormService;
import com.eventmanagement.backend.service.organizer.FeedbackService;
import com.eventmanagement.backend.service.organizer.RecruitmentServiceOrganizer;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(FeedbackController.class)
@AutoConfigureMockMvc(addFilters = false) 
public class FeedbackListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private FeedbackRepository feedbackRepository;

    @MockitoBean
    private CustomFormRepository customFormRepository;

    @MockitoBean
    private CustomFormService customFormService;

    @MockitoBean
    private FeedbackService feedbackService;

    @MockitoBean
    private RecruitmentService recruitmentService;

    @MockitoBean
    private RecruitmentServiceOrganizer recruitmentServiceOrganizer;


    @Test
    void testGetEventFeedbacks_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        List<FeedbackResponseDTO> mockFeedbacks = new ArrayList<>();
        
        when(feedbackRepository.findFeedbacksByEventId(eventId)).thenReturn(mockFeedbacks);
        
        mockMvc.perform(get("/api/events/" + eventId + "/feedback")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedbacks").exists());
    }

    @Test
    void testGetFeedbackDetail_Success() throws Exception {
        UUID feedbackId = UUID.randomUUID(); 
        FeedbackDetailResponseDTO mockDetailResponse = org.mockito.Mockito.mock(FeedbackDetailResponseDTO.class);
        when(feedbackService.getFeedbackDetail(feedbackId)).thenReturn(mockDetailResponse);
        mockMvc.perform(get("/api/feedbacks/" + feedbackId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()); 
    }

    //RECRUITEMENT FORM
    @Test
    void testGetEventForm_Recruitment_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        com.eventmanagement.backend.model.CustomForm mockForm = new com.eventmanagement.backend.model.CustomForm();
        mockForm.setFormName("Form Tuyển Dụng Tình Nguyện Viên");
        
        when(customFormService.getFormByType(eq(eventId), any())).thenReturn(mockForm);

        mockMvc.perform(get("/api/events/" + eventId + "/forms")
                .param("type", "RECRUITMENT")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.formName").value("Form Tuyển Dụng Tình Nguyện Viên"));
    }

    @Test
    void testGetEventForm_NoContent() throws Exception {
        UUID eventId = UUID.randomUUID();
        
        when(customFormService.getFormByType(eq(eventId), any())).thenReturn(null);

        mockMvc.perform(get("/api/events/" + eventId + "/forms")
                .param("type", "RECRUITMENT")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Chưa có form nào được tạo"));
    }
}