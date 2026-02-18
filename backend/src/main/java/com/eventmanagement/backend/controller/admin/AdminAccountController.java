package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/admin/accounts")
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
}
