package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.request.CreateOrganizerRequest;
import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.util.GenerateAvatarUrl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAccountServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private GenerateAvatarUrl generateAvatarUrl;

    @InjectMocks
    private AdminAccountService adminAccountService;

    private CreateOrganizerRequest request;

    @BeforeEach
    void setUp() {
        request = CreateOrganizerRequest.builder()
                .email("organizer@gmail.com")
                .password("Password123@")
                .fullName("John Doe")
                .phone("0912345678")
                .build();
    }

    // CREATE SUCCESS
    @Test
    void createOrganizer_Success() {

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encodedPassword");

        when(generateAvatarUrl.generateAvatarUrl(request.getFullName()))
                .thenReturn("avatar-url");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = adminAccountService.createOrganizer(request);

        assertNotNull(response);

        verify(userRepository).existsByEmail(request.getEmail());
        verify(passwordEncoder).encode(request.getPassword());
        verify(generateAvatarUrl).generateAvatarUrl(request.getFullName());
        verify(userRepository).save(any(User.class));
    }

}
