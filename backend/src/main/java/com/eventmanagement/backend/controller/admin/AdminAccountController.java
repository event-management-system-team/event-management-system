package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.request.CreateOrganizerRequest;
import com.eventmanagement.backend.dto.request.UserUpdateRequest;
import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.dto.response.admin.AccountSummaryResponse;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AdminAccountController {
    private final AdminAccountService adminAccountService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminAccountService.getAllAccounts(page, size));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAll() {
        List<UserResponse> users = adminAccountService.getAllAccountsPlain();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/summary")
    public ResponseEntity<AccountSummaryResponse> getAccountSummary() {
        return ResponseEntity.ok(adminAccountService.getAccountSummary());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(adminAccountService.getAccountById(id));
    }

    @GetMapping("/{id}/event-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getEventCount(@PathVariable UUID id) {
        return ResponseEntity.ok(eventRepository.countByOrganizer_UserId(id));
    }

    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable UUID id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(adminAccountService.updateProfile(id, request));
    }

    @PatchMapping("/{id}/toggle-ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleBan(@PathVariable UUID id) {
        return ResponseEntity.ok(adminAccountService.toggleBanAccount(id));
    }

    @PostMapping("/organizer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createOrganizer(@Valid @RequestBody CreateOrganizerRequest request) {
        return ResponseEntity.ok(adminAccountService.createOrganizer(request));
    }

    @GetMapping("/check-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(userRepository.existsByEmail(email));
    }
}
