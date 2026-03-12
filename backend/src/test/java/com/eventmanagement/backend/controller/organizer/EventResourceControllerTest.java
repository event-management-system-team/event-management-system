package com.eventmanagement.backend.controller.organizer;
import com.eventmanagement.backend.constants.ResourceType;
import com.eventmanagement.backend.dto.request.CreateResourceRequest;
import com.eventmanagement.backend.dto.response.organizer.ResourceResponse;
import com.eventmanagement.backend.service.EventResourceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class EventResourceControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EventResourceService eventResourceService;

    private ObjectMapper objectMapper = new ObjectMapper();
    private UUID eventId;
    private CreateResourceRequest request;

//    @BeforeEach
//    void setUp() {
//        eventId = UUID.randomUUID();
//
//        request = CreateResourceRequest.builder()
//                .resourceName("Stage Plan")
//                .description("Stage layout file")
//                .fileUrl("https://example.com/file.pdf")
//                .fileType("pdf")
//                .fileSize(1024)
//                .resourceType(ResourceType.DOCUMENT)
//                .build();
//    }

    // CREATE SUCCESS
//    @Test
//    void createResource_Success() throws Exception {
//
//        ResourceResponse response = ResourceResponse.builder()
//                .resourceId(UUID.randomUUID())
//                .resourceName("Stage Plan")
//                .description("Stage layout file")
//                .fileUrl("https://example.com/file.pdf")
//                .fileType("pdf")
//                .fileSize(1024)
//                .resourceType("DOCUMENT")
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        when(eventResourceService.createResource(eq(eventId), any()))
//                .thenReturn(response);
//
//        mockMvc.perform(post("/api/events/{id}/resources", eventId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.resourceName").value("Stage Plan"))
//                .andExpect(jsonPath("$.resourceType").value("DOCUMENT"));
//    }
}
