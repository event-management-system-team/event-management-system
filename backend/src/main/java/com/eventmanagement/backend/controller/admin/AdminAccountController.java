package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.request.UserUpdateRequest;
import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {
    private final AdminService adminService;

//    @GetMapping
//    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page,
//                                    @RequestParam(defaultValue = "10") int size) {
//        return ResponseEntity.ok(adminService.getAllAccounts(PageRequest.of(page, size)));
//    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll() {
        List<UserResponse> users = adminService.getAllAccountsPlain();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> search(@RequestParam("q") String q) {
        List<UserResponse> results = adminService.searchAccounts(q);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getAccountById(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable UUID id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateProfile(id, request));
    }
}
