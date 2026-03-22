package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.request.CreateOrganizerRequest;
import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.service.AdminAccountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AccountControllerTest {
    private MockMvc mockMvc;

    @Mock
    AdminAccountService adminAccountService;

    @Mock
    UserRepository userRepository;

    @Mock
    EventRepository eventRepository;

    @InjectMocks
    private AdminAccountController accountController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(accountController).build();
    }

    @Test
    void createOrganizer_success() throws Exception {

        UUID userId = UUID.randomUUID();

        CreateOrganizerRequest request = CreateOrganizerRequest.builder()
                .fullName("John Doe")
                .email("johndoe@gmail.com")
                .phone("0912345678")
                .password("Johndoe123@")
                .build();

        UserResponse response = UserResponse.builder()
                .userId(userId)
                .fullName("John Doe")
                .email("johndoe@gmail.com")
                .phone("0912345678")
                .build();

        when(adminAccountService.createOrganizer(any(CreateOrganizerRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/admin/accounts/organizer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.email").value("johndoe@gmail.com"))
                .andExpect(jsonPath("$.phone").value("0912345678"));
    }
}
