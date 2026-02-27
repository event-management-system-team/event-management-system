package com.eventmanagement.backend.controller.event;

import com.eventmanagement.backend.dto.response.attendee.EventResponse;
import com.eventmanagement.backend.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(eventController).build();
    }

    @Test
    void getTopNewEvents_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("New Featured Event")
                .location("Hanoi")
                .build();

        when(eventService.getTopNewEvents()).thenReturn(Collections.singletonList(eventResponse));

        mockMvc.perform(get("/api/events/featured")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$[0].eventName").value("New Featured Event"))
                .andExpect(jsonPath("$[0].location").value("Hanoi"));
    }

    @Test
    void getTopHotEvents_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Hot Event")
                .location("HCMC")
                .build();

        when(eventService.getHotEvents()).thenReturn(Collections.singletonList(eventResponse));

        mockMvc.perform(get("/api/events/hot")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$[0].eventName").value("Hot Event"))
                .andExpect(jsonPath("$[0].location").value("HCMC"));
    }

    @Test
    void searchEvents_WithFilters_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Tech Conference")
                .location("Da Nang")
                .minPrice(BigDecimal.valueOf(100))
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        // Mock the service call with relevant filter arguments
        when(eventService.searchEvents(
                eq("Tech"),
                eq("Da Nang"),
                any(),
                any(),
                eq(BigDecimal.valueOf(100)),
                eq(false),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("keyword", "Tech")
                .param("location", "Da Nang")
                .param("price", "100")
                .param("isFree", "false")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Tech Conference"))
                .andExpect(jsonPath("$.content[0].location").value("Da Nang"));
    }

    @Test
    void searchEvents_NoFilters_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("General Event")
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        when(eventService.searchEvents(
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("General Event"));
    }

    @Test
    void searchEvents_WithKeywordOnly_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Keyword Event")
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        when(eventService.searchEvents(
                eq("Keyword"),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("keyword", "Keyword")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Keyword Event"));
    }

    @Test
    void searchEvents_WithLocationOnly_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Location Event")
                .location("Da Nang")
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        when(eventService.searchEvents(
                isNull(),
                eq("Da Nang"),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("location", "Da Nang")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Location Event"))
                .andExpect(jsonPath("$.content[0].location").value("Da Nang"));
    }

    @Test
    void searchEvents_WithCategoriesOnly_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Category Event")
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        when(eventService.searchEvents(
                isNull(),
                isNull(),
                eq(List.of("music", "tech")),
                isNull(),
                isNull(),
                isNull(),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("categories", "music,tech")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Category Event"));
    }

    @Test
    void searchEvents_WithDateOnly_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Date Event")
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));
        LocalDate testDate = LocalDate.of(2024, 12, 25);

        when(eventService.searchEvents(
                isNull(),
                isNull(),
                isNull(),
                eq(testDate),
                isNull(),
                isNull(),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("date", "25/12/2024")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Date Event"));
    }

    @Test
    void searchEvents_WithPriceOnly_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Price Event")
                .minPrice(BigDecimal.valueOf(500))
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        when(eventService.searchEvents(
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(BigDecimal.valueOf(500)),
                isNull(),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("price", "500")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Price Event"));
    }

    @Test
    void searchEvents_WithIsFreeOnly_Success() throws Exception {
        UUID eventId = UUID.randomUUID();
        EventResponse eventResponse = EventResponse.builder()
                .eventId(eventId)
                .eventName("Free Event")
                .isFree(true)
                .build();

        Page<EventResponse> pageResponse = new PageImpl<>(List.of(eventResponse));

        when(eventService.searchEvents(
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(true),
                eq(0),
                eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/events/search")
                .param("isFree", "true")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.content[0].eventName").value("Free Event"));
    }
}
