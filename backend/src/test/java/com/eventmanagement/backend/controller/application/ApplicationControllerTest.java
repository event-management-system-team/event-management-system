package com.eventmanagement.backend.controller.application;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.eventmanagement.backend.dto.response.organizer.ApplicationResponseDTO;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.service.ApplicationService;
import com.eventmanagement.backend.service.organizer.ApplicationServiceOrganizer;


@WebMvcTest(ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private  ApplicationService applicationService;

    @MockitoBean
    private ApplicationServiceOrganizer applicationServiceOrganizer;

    @Test
    void testGetApplicationsByRecruitment_Success() throws Exception {
        UUID recruitmentId = UUID.randomUUID();
        ApplicationResponseDTO mockResponse = ApplicationResponseDTO.builder()
                .name("Nguyen Van B")
                .email("nguyenvanb@test.com")
                .build();
                
        when(applicationServiceOrganizer.getApplicationsByRecruitment(recruitmentId))
                .thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/applications/recruitments/" + recruitmentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Nguyen Van B"))
                .andExpect(jsonPath("$[0].email").value("nguyenvanb@test.com"));
    }

    @Test
    void testGetApplicationDetail_Success() throws Exception {
        UUID applicationId = UUID.randomUUID();
        
        ApplicationResponseDTO mockDetail = ApplicationResponseDTO.builder()
                .name("Tran Van D")
                .email("tranvand@test.com")
                .resume("cv_link.pdf")
                .build();
                
        when(applicationServiceOrganizer.getApplicationDetail(applicationId)).thenReturn(mockDetail);

        mockMvc.perform(get("/api/applications/" + applicationId) // Sửa đường dẫn nếu cần
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Tran Van D"))
                .andExpect(jsonPath("$.resume").value("cv_link.pdf"));
    }

    @Test
    void testUpdateApplicationStatus_Success() throws Exception {
        UUID applicationId = UUID.randomUUID();
        
        com.eventmanagement.backend.dto.request.UpdateApplicationStatusRequest request = 
                new com.eventmanagement.backend.dto.request.UpdateApplicationStatusRequest();
        request.setStatus(com.eventmanagement.backend.constants.ApplicationStatus.APPROVED);

        com.eventmanagement.backend.model.StaffApplication mockUpdatedApp = new com.eventmanagement.backend.model.StaffApplication();
        mockUpdatedApp.setApplicationStatus(com.eventmanagement.backend.constants.ApplicationStatus.APPROVED);
        
        when(applicationServiceOrganizer.updateApplicationStatuss(eq(applicationId), eq(com.eventmanagement.backend.constants.ApplicationStatus.APPROVED)))
                .thenReturn(mockUpdatedApp);

        mockMvc.perform(put("/api/applications/" + applicationId + "/status") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật trạng thái ứng viên thành công!"));
    }

    @Test
    void testUpdateApplicationStatus_NullStatus_BadRequest() throws Exception {
        UUID applicationId = UUID.randomUUID();
        
        com.eventmanagement.backend.dto.request.UpdateApplicationStatusRequest request = 
                new com.eventmanagement.backend.dto.request.UpdateApplicationStatusRequest();

        mockMvc.perform(put("/api/applications/" + applicationId + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Trạng thái (status) không được để trống!"));
    }


}