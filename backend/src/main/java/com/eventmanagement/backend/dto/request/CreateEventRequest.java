package com.eventmanagement.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class CreateEventRequest {

    @NotBlank(message = "Event name is required")
    @Size(max = 255, message = "Event name must be at most 255 characters")
    private String eventName;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    private String description;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    private String location;

    @JsonProperty("location_coordinates")
    private Map<String, Double> locationCoordinates;

    @Valid
    private List<TicketRequest> tickets;

    @JsonProperty("isFree")
    private boolean isFree;

    private Integer totalCapacity;

    private boolean draft;

    @Valid
    private List<AgendaRequest> agenda;

    @Data
    public static class TicketRequest {
        @NotBlank(message = "Ticket name is required")
        private String name;

        @NotNull(message = "Ticket quantity is required")
        private Integer quantity;

        private BigDecimal price;
    }

    @Data
    public static class AgendaRequest {
        @NotBlank(message = "Session title is required")
        private String title;

        @NotBlank(message = "Start time is required")
        private String startTime;

        @NotBlank(message = "End time is required")
        private String endTime;

        private String description;
        private String location;
    }
}
