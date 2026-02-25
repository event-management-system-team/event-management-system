package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.Role;
import com.eventmanagement.backend.constants.Status;
import com.eventmanagement.backend.dto.request.GoogleLoginRequest;
import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.request.RegisterRequest;
import com.eventmanagement.backend.dto.response.GoogleLoginResponse;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.dto.response.RefreshTokenResponse;
import com.eventmanagement.backend.dto.response.RegisterResponse;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtTokenProvider;
import com.eventmanagement.backend.util.CookieUtil;
import com.eventmanagement.backend.util.GenerateAvatarUrl;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private GoogleOAuthService googleOAuthService;

    @Mock
    private CookieUtil cookieUtil;

    @Mock
    private GenerateAvatarUrl generateAvatarUrl;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(UUID.randomUUID())
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .fullName("Test User")
                .role(Role.ATTENDEE)
                .status(Status.ACTIVE)
                .build();

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
        loginRequest.setRememberMe(false);

        ReflectionTestUtils.setField(authService, "refreshTokenExpiration", 604800000L); // 7 days in ms
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn("mockRefreshToken");

        LoginResponse result = authService.login(loginRequest, response);

        assertNotNull(result);
        assertEquals("mockAccessToken", result.getAccessToken());
        assertEquals("Bearer", result.getTokenType());
        assertNotNull(result.getUser());
        assertEquals("test@example.com", result.getUser().getEmail());

        verify(userRepository).save(any(User.class));
        verify(cookieUtil).addRefreshTokenCookie(eq(response), eq("mockRefreshToken"), eq(-1));
    }

    @Test
    void login_Success_WithRememberMe() {
        loginRequest.setRememberMe(true);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn("mockRefreshToken");

        LoginResponse result = authService.login(loginRequest, response);

        assertNotNull(result);

        int expectedMaxAge = (int) (604800000L / 60);
        verify(cookieUtil).addRefreshTokenCookie(eq(response), eq("mockRefreshToken"), eq(expectedMaxAge));
    }

    @Test
    void login_Failure_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authService.login(loginRequest, response);
        });

        assertEquals("Incorrect email or password", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Failure_WrongPassword() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authService.login(loginRequest, response);
        });

        assertEquals("Incorrect email or password", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Failure_AccountBanned() {
        testUser.setStatus(Status.BANNED);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            authService.login(loginRequest, response);
        });

        assertEquals("Your account has been locked.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginWithGoogle_Success_ExistingUser_ByGoogleId() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setGoogleToken("validGoogleToken");

        GoogleLoginResponse googleUser = new GoogleLoginResponse();
        googleUser.setEmail("test@example.com");
        googleUser.setSub("googleId123");
        googleUser.setEmailVerified(true);
        googleUser.setPicture("pictureUrl");
        googleUser.setName("Test User");

        when(googleOAuthService.verifyGoogleToken(anyString())).thenReturn(googleUser);

        testUser.setGoogleId("googleId123");
        when(userRepository.findByGoogleId(anyString())).thenReturn(Optional.of(testUser));

        when(jwtTokenProvider.generateAccessToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn("mockRefreshToken");

        LoginResponse result = authService.loginWithGoogle(request, response);

        assertNotNull(result);
        assertEquals("mockAccessToken", result.getAccessToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void loginWithGoogle_Success_ExistingUser_ByEmail() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setGoogleToken("validGoogleToken");

        GoogleLoginResponse googleUser = new GoogleLoginResponse();
        googleUser.setEmail("test@example.com");
        googleUser.setSub("googleId123");
        googleUser.setEmailVerified(true);
        googleUser.setPicture("pictureUrl");
        googleUser.setName("Test User");

        when(googleOAuthService.verifyGoogleToken(anyString())).thenReturn(googleUser);
        when(userRepository.findByGoogleId(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        when(jwtTokenProvider.generateAccessToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn("mockRefreshToken");

        LoginResponse result = authService.loginWithGoogle(request, response);

        assertNotNull(result);
        assertEquals("googleId123", testUser.getGoogleId()); // Ensure it was linked
        verify(userRepository).save(any(User.class));
    }

    @Test
    void loginWithGoogle_Success_NewUser() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setGoogleToken("validGoogleToken");

        GoogleLoginResponse googleUser = new GoogleLoginResponse();
        googleUser.setEmail("newuser@example.com");
        googleUser.setSub("googleId123");
        googleUser.setEmailVerified(true);
        googleUser.setPicture("pictureUrl");
        googleUser.setName("New User");

        User newUser = User.builder()
                .userId(UUID.randomUUID())
                .email("newuser@example.com")
                .googleId("googleId123")
                .role(Role.ATTENDEE)
                .status(Status.ACTIVE)
                .build();

        when(googleOAuthService.verifyGoogleToken(anyString())).thenReturn(googleUser);
        when(userRepository.findByGoogleId(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(newUser).thenReturn(newUser);

        when(jwtTokenProvider.generateAccessToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn("mockRefreshToken");

        LoginResponse result = authService.loginWithGoogle(request, response);

        assertNotNull(result);
        verify(userRepository, times(2)).save(any(User.class)); // 1 for creation, 1 for update
    }

    @Test
    void loginWithGoogle_Failure_AccountBanned() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setGoogleToken("validGoogleToken");

        GoogleLoginResponse googleUser = new GoogleLoginResponse();
        googleUser.setEmail("test@example.com");
        googleUser.setSub("googleId123");

        when(googleOAuthService.verifyGoogleToken(anyString())).thenReturn(googleUser);

        testUser.setStatus(Status.BANNED);
        when(userRepository.findByGoogleId(anyString())).thenReturn(Optional.of(testUser));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            authService.loginWithGoogle(request, response);
        });

        assertEquals("Your account has been locked.", exception.getMessage());
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setPassword("Password123!");
        request.setConfirmPassword("Password123!");
        request.setFullName("New User");
        request.setPhone("0123456789");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(generateAvatarUrl.generateAvatarUrl(anyString())).thenReturn("avatarUrl");

        User savedUser = User.builder()
                .userId(UUID.randomUUID())
                .email("new@example.com")
                .fullName("New User")
                .phone("0123456789")
                .avatarUrl("avatarUrl")
                .role(Role.ATTENDEE)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        RegisterResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("new@example.com", response.getEmail());
        assertEquals("Registration successful! Please log in to continue.", response.getMessage());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_Failure_PasswordsDoNotMatch() {
        RegisterRequest request = new RegisterRequest();
        request.setPassword("Password123!");
        request.setConfirmPassword("Different123!");

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            authService.register(request);
        });

        assertEquals("Passwords do not match", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_Failure_EmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("Password123!");
        request.setConfirmPassword("Password123!");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void refreshToken_Success() {
        String refreshToken = "validRefreshToken";
        UUID userId = testUser.getUserId();

        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(true);
        when(jwtTokenProvider.getUserIdFromToken(refreshToken)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateAccessToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("newAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn("newRefreshToken");

        RefreshTokenResponse result = authService.refreshToken(refreshToken, response);

        assertNotNull(result);
        assertEquals("newAccessToken", result.getAccessToken());
        verify(cookieUtil).addRefreshTokenCookie(eq(response), eq("newRefreshToken"), anyInt());
    }

    @Test
    void refreshToken_Failure_InvalidToken() {
        String refreshToken = "invalidToken";
        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(false);

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authService.refreshToken(refreshToken, response);
        });

        assertEquals("Invalid refresh token", exception.getMessage());
    }

    @Test
    void refreshToken_Failure_UserNotFound() {
        String refreshToken = "validRefreshToken";
        UUID userId = UUID.randomUUID();

        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(true);
        when(jwtTokenProvider.getUserIdFromToken(refreshToken)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authService.refreshToken(refreshToken, response);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void refreshToken_Failure_AccountBanned() {
        String refreshToken = "validRefreshToken";
        UUID userId = testUser.getUserId();

        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(true);
        when(jwtTokenProvider.getUserIdFromToken(refreshToken)).thenReturn(userId);
        testUser.setStatus(Status.BANNED);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            authService.refreshToken(refreshToken, response);
        });

        assertEquals("Your account has been locked.", exception.getMessage());
    }

    @Test
    void logout_Success() {
        authService.logout(response);
        verify(cookieUtil).removeRefreshTokenCookie(response);
    }
}
