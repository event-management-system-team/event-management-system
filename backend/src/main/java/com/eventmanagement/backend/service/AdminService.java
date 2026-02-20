package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.request.UserUpdateRequest;
import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    // get account list (+pagination)
//    public Page<UserResponse> getAllAccounts(Pageable pageable) {
//        return userRepository.findAll(pageable).map(this::mapToResponse);
//    }

    public List<UserResponse> getAllAccountsPlain() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> searchAccounts(String keyword) {
        List<User> users = userRepository.searchUsers(keyword);

        return users.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public UserResponse getAccountById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User does not exist"));
        return mapToResponse(user);
    }

    public UserResponse updateProfile(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User does not exist"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        return mapToResponse(userRepository.save(user));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
