package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    // get account list (+pagination)
//    public Page<UserResponse> getAllAccounts(Pageable pageable) {
//        return userRepository.findAll(pageable).map(this::mapToResponse);
//    }

    // Lấy tất cả account không phân trang
    public List<UserResponse> getAllAccountsPlain() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
