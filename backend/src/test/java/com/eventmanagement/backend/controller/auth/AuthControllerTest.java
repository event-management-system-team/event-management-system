package com.eventmanagement.backend.controller.auth;

import com.eventmanagement.backend.dto.request.GoogleLoginRequest;
import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.request.RegisterRequest;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.dto.response.RefreshTokenResponse;
import com.eventmanagement.backend.dto.response.RegisterResponse;
import com.eventmanagement.backend.service.AuthService;
import com.eventmanagement.backend.util.CookieUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import jakarta.servlet.http.HttpServletResponse;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private CookieUtil cookieUtil;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        LoginResponse.UserInfor userInfo = LoginResponse.UserInfor.builder()
                .user_id(UUID.randomUUID())
                .email("test@example.com")
                .build();

        LoginResponse loginResponse = LoginResponse.builder()
                .accessToken("mockAccessToken")
                .tokenType("Bearer")
                .user(userInfo)
                .build();

        when(authService.login(any(LoginRequest.class), any(HttpServletResponse.class))).thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mockAccessToken"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void login_Failure_Validation() throws Exception {
        LoginRequest loginRequest = new LoginRequest(); // Missing email and password

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginWithGoogle_Success() throws Exception {
        GoogleLoginRequest googleRequest = new GoogleLoginRequest();
        googleRequest.setGoogleToken("validGoogleToken");

        LoginResponse.UserInfor userInfo = LoginResponse.UserInfor.builder()
                .user_id(UUID.randomUUID())
                .email("google@example.com")
                .build();

        LoginResponse loginResponse = LoginResponse.builder()
                .accessToken("mockGoogleAccessToken")
                .tokenType("Bearer")
                .user(userInfo)
                .build();

        when(authService.loginWithGoogle(any(GoogleLoginRequest.class), any(HttpServletResponse.class)))
                .thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(googleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mockGoogleAccessToken"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("google@example.com"));
    }

    @Test
    void loginWithGoogle_Failure_Validation() throws Exception {
        GoogleLoginRequest googleRequest = new GoogleLoginRequest(); // Missing token

        mockMvc.perform(post("/api/auth/google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(googleRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_Success() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("new@example.com");
        registerRequest.setPassword("Password123!");
        registerRequest.setConfirmPassword("Password123!");
        registerRequest.setFullName("New User");
        registerRequest.setPhone("0123456789");

        RegisterResponse registerResponse = RegisterResponse.builder()
                .email("new@example.com")
                .message("Registration successful! Please log in to continue.")
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(registerResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("new@example.com"))
                .andExpect(jsonPath("$.message").value("Registration successful! Please log in to continue."));
    }

    @Test
    void register_Failure_Validation() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(); // Missing fields

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void logout_Success() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void refreshToken_Success() throws Exception {
        RefreshTokenResponse tokenResponse = RefreshTokenResponse.builder()
                .accessToken("newAccessToken")
                .tokenType("Bearer")
                .build();

        when(cookieUtil.getRefreshTokenFromCookie(any())).thenReturn(java.util.Optional.of("validRefreshToken"));
        when(authService.refreshToken(anyString(), any())).thenReturn(tokenResponse);

        mockMvc.perform(post("/api/auth/refresh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void refreshToken_Failure_NoCookie() throws Exception {
        when(cookieUtil.getRefreshTokenFromCookie(any())).thenReturn(java.util.Optional.empty());

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(Exception.class, () -> {
            mockMvc.perform(post("/api/auth/refresh"));
        });

        org.junit.jupiter.api.Assertions.assertTrue(exception.getCause() instanceof RuntimeException);
        org.junit.jupiter.api.Assertions.assertEquals("Refresh token not found", exception.getCause().getMessage());
    }
}
