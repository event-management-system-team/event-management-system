package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.request.RejectEventRequest;
import com.eventmanagement.backend.service.AdminEventService;
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

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {
    private MockMvc mockMvc;

    @Mock
    private AdminEventService eventService;

    @InjectMocks
    private AdminEventController controller;

    private ObjectMapper objectMapper = new ObjectMapper();
    private UUID eventId;

//    @BeforeEach
//    void setup() {
//        eventId = UUID.randomUUID();
//        mockMvc = MockMvcBuilders
//                .standaloneSetup(controller)
//                .build();
//    }
//
//    // APPROVE SUCCESS
//    @Test
//    void approveEvent_Success() throws Exception {
//
//        mockMvc.perform(patch("/api/admin/events/" + eventId + "/approve"))
//                .andExpect(status().isNoContent());
//
//        verify(eventService).approveEvent(eventId);
//    }
//
//    // REJECT SUCCESS (reason <= 255)
//    @Test
//    void rejectEvent_ValidReason_Success() throws Exception {
//
//        RejectEventRequest request = new RejectEventRequest();
//        request.setReason("Invalid event info");
//
//        mockMvc.perform(patch("/api/admin/events/" + eventId + "/reject")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isNoContent());
//
//        verify(eventService).rejectEvent(eventId, "Invalid event info");
//    }
//
//    // REJECT - NOTE > 255 CHAR
//    @Test
//    void rejectEvent_ReasonTooLong_ReturnBadRequest() throws Exception {
//
//        RejectEventRequest request = new RejectEventRequest();
//        request.setReason("A".repeat(256));
//
//        mockMvc.perform(patch("/api/admin/events/" + eventId + "/reject")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//    }
//
//    // REJECT - NULL REASON
//    @Test
//    void rejectEvent_NullReason_ReturnBadRequest() throws Exception {
//
//        RejectEventRequest request = new RejectEventRequest();
//        request.setReason(null);
//
//        mockMvc.perform(patch("/api/admin/events/" + eventId + "/reject")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//    }
}
