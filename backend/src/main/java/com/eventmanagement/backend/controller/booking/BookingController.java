package com.eventmanagement.backend.controller.booking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.request.CreateOrderRequest;
import com.eventmanagement.backend.dto.request.ReservationRequest;
import com.eventmanagement.backend.dto.response.OrderResponse;
import com.eventmanagement.backend.dto.response.ReservationResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/reserve")
    @PreAuthorize("hasRole('ATTENDEE')")
    public ResponseEntity<ReservationResponse> reserve(@Valid @RequestBody ReservationRequest request,
            @AuthenticationPrincipal User user) {

        ReservationResponse response = bookingService.reserveTickets(request, user.getUserId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders")
    @PreAuthorize("hasAnyRole('ATTENDEE')")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User user) {

        OrderResponse response = bookingService.createOrder(request, user.getUserId());

        return ResponseEntity.ok(response);
    }
}
