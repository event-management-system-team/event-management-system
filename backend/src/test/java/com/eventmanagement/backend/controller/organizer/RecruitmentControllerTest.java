package com.eventmanagement.backend.controller.organizer;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.eventmanagement.backend.controller.recruitment.RecruitmentController;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.service.ApplicationFormService;
import com.eventmanagement.backend.service.CloudinaryService;
import com.eventmanagement.backend.service.attendee.RecruitmentService;
import com.eventmanagement.backend.service.organizer.CustomFormService;
import com.eventmanagement.backend.service.organizer.RecruitmentServiceOrganizer;

// Thay RecruitmentController bằng tên class Controller thực tế của bạn
@WebMvcTest(RecruitmentController.class) 
@AutoConfigureMockMvc(addFilters = false)
public class RecruitmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private  RecruitmentService recruitmentService;
    @MockitoBean
    private  ApplicationFormService applicationFormService;
    @MockitoBean
    private  CloudinaryService cloudinaryService;
    @MockitoBean
    private  CustomFormService customFormService;
    @MockitoBean
    private  RecruitmentRepository recruitmentRepository;
    @MockitoBean
    private  RecruitmentServiceOrganizer recruitmentServiceOrganizer;
    @MockitoBean
    private UserRepository userRepository;
    @Test
    void testGetDashboardData_Success() throws Exception {

        RecruitmentDashBoardDTO mockResponse = org.mockito.Mockito.mock(RecruitmentDashBoardDTO.class);
        
        when(recruitmentServiceOrganizer.getDashBoardData()).thenReturn(mockResponse);

        mockMvc.perform(get("/api/recruitments/dashboards") 
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}