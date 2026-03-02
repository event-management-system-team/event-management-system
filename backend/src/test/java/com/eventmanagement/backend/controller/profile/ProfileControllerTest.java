package com.eventmanagement.backend.controller.profile;

import com.eventmanagement.backend.dto.request.ChangePasswordRequest;
import com.eventmanagement.backend.dto.request.UpdateProfileRequest;
import com.eventmanagement.backend.dto.response.ProfileResponse;
import com.eventmanagement.backend.exception.GlobalExceptionHandler;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProfileService profileService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private ProfileController profileController;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UUID mockUserId = UUID.randomUUID();
    private final String mockToken = "valid.mock.token";
    private final String authHeader = "Bearer " + mockToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(profileController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ==========================================
    // GET /api/profile/me
    // ==========================================

    @Test
    void getMyProfile_Success() throws Exception {
        ProfileResponse response = ProfileResponse.builder()
                .userId(mockUserId)
                .email("test@example.com")
                .fullName("Test User")
                .build();

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);
        when(profileService.getProfile(mockUserId)).thenReturn(response);

        mockMvc.perform(get("/api/profile/me")
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.fullName").value("Test User"));
    }

    @Test
    void getMyProfile_Failure_MissingAuthHeader() throws Exception {
        mockMvc.perform(get("/api/profile/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Missing or invalid Authorization header"));
    }

    @Test
    void getMyProfile_Failure_InvalidAuthHeaderFormat() throws Exception {
        mockMvc.perform(get("/api/profile/me")
                .header("Authorization", "InvalidFormat " + mockToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Missing or invalid Authorization header"));
    }

    @Test
    void getMyProfile_Failure_ExpiredToken() throws Exception {
        when(jwtTokenProvider.getUserIdFromToken(mockToken))
                .thenThrow(new io.jsonwebtoken.ExpiredJwtException(null, null, "Token expired"));

        mockMvc.perform(get("/api/profile/me")
                .header("Authorization", authHeader))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token has expired. Please log in again"));
    }

    @Test
    void getMyProfile_Failure_InvalidToken() throws Exception {
        when(jwtTokenProvider.getUserIdFromToken(mockToken))
                .thenThrow(new RuntimeException("Bad token"));

        mockMvc.perform(get("/api/profile/me")
                .header("Authorization", authHeader))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid token"));
    }

    // ==========================================
    // GET /api/profile/{userId}
    // ==========================================

    @Test
    void getUserProfile_Success() throws Exception {
        UUID targetUserId = UUID.randomUUID();
        ProfileResponse response = ProfileResponse.builder()
                .userId(targetUserId)
                .email("target@example.com")
                .fullName("Target User")
                .build();

        when(profileService.getProfile(targetUserId)).thenReturn(response);

        mockMvc.perform(get("/api/profile/{userId}", targetUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("target@example.com"))
                .andExpect(jsonPath("$.fullName").value("Target User"));
    }

    // ==========================================
    // PUT /api/profile/me (UpdateProfileRequest Validations)
    // ==========================================

    @Test
    void updateProfile_Success() throws Exception {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("Updated Name");
        req.setPhone("0123456789");
        req.setAvatarUrl("http://example.com/avatar.jpg");

        ProfileResponse response = ProfileResponse.builder()
                .userId(mockUserId)
                .fullName("Updated Name")
                .phone("0123456789")
                .avatarUrl("http://example.com/avatar.jpg")
                .build();

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);
        when(profileService.updateProfile(eq(mockUserId), any(UpdateProfileRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/profile/me")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.phone").value("0123456789"))
                .andExpect(jsonPath("$.avatarUrl").value("http://example.com/avatar.jpg"));
    }

    @Test
    void updateProfile_Failure_FullNameTooShort() throws Exception {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("A"); // min = 2

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(put("/api/profile/me")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.fullName").value("Full name must be at least 2 characters long"));
    }

    @Test
    void updateProfile_Failure_PhoneTooShort() throws Exception {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setPhone("123456789"); // 9 digits

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(put("/api/profile/me")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").value("Phone number must be 10 digits long"));
    }

    @Test
    void updateProfile_Failure_PhoneTooLong() throws Exception {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setPhone("01234567890"); // 11 digits

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(put("/api/profile/me")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").value("Phone number must be 10 digits long"));
    }

    @Test
    void updateProfile_Failure_PhoneContainsLetters() throws Exception {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setPhone("012345678a"); // contains letter

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(put("/api/profile/me")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").value("Phone number must contain only digits"));
    }

    @Test
    void updateProfile_Failure_PhoneContainsSpecialChars() throws Exception {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setPhone("012-456789"); // contains special char

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(put("/api/profile/me")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").value("Phone number must contain only digits"));
    }

    // ==========================================
    // POST /api/profile/change-password (ChangePasswordRequest Validations)
    // ==========================================

    @Test
    void changePassword_Success() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("OldP@ssword1");
        req.setNewPassword("NewP@ssword1");
        req.setConfirmPassword("NewP@ssword1");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully"));
    }

    @Test
    void changePassword_Failure_NewPasswordTooShort() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("Aa1@b"); // Too short
        req.setConfirmPassword("Aa1@b");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.newPassword").value("Password must be at least 8 characters long"));
    }

    @Test
    void changePassword_Failure_NewPasswordNoUppercase() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("abcdefg1@"); // No uppercase
        req.setConfirmPassword("abcdefg1@");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.newPassword").value(
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number"));
    }

    @Test
    void changePassword_Failure_NewPasswordNoLowercase() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("ABCDEFG1@"); // No lowercase
        req.setConfirmPassword("ABCDEFG1@");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.newPassword").value(
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number"));
    }

    @Test
    void changePassword_Failure_NewPasswordNoDigit() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("Abcdefgh@"); // No digit
        req.setConfirmPassword("Abcdefgh@");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.newPassword").value(
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number"));
    }

    @Test
    void changePassword_Failure_NewPasswordNoSpecialChar() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("Abcdefgh1"); // No special char
        req.setConfirmPassword("Abcdefgh1");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.newPassword").value(
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number"));
    }

    @Test
    void changePassword_Failure_NullConfirmPassword() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("Str0ngP@ssword1");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.confirmPassword").value("Confirm password is required"));
    }

    @Test
    void changePassword_Failure_EmptyConfirmPassword() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setNewPassword("Str0ngP@ssword1");
        req.setConfirmPassword("");

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);

        mockMvc.perform(post("/api/profile/change-password")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.confirmPassword").value("Confirm password is required"));
    }

    // ==========================================
    // POST /api/profile/upload-avatar
    // ==========================================

    @Test
    void uploadAvatar_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "fake-image-content".getBytes());

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);
        when(profileService.uploadAvatar(eq(mockUserId), any())).thenReturn("http://example.com/new-avatar.jpg");

        mockMvc.perform(multipart("/api/profile/upload-avatar")
                .file(file)
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avatarUrl").value("http://example.com/new-avatar.jpg"))
                .andExpect(jsonPath("$.message").value("Avatar uploaded successfully"));
    }

    @Test
    void uploadAvatar_Failure_ServiceException() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "fake-image-content".getBytes());

        when(jwtTokenProvider.getUserIdFromToken(mockToken)).thenReturn(mockUserId);
        when(profileService.uploadAvatar(eq(mockUserId), any())).thenThrow(new RuntimeException("Upload failed"));

        mockMvc.perform(multipart("/api/profile/upload-avatar")
                .file(file)
                .header("Authorization", authHeader))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Upload failed"));
    }
}
