package com.eventmanagement.backend.controller.auth;

import com.eventmanagement.backend.dto.request.GoogleLoginRequest;
import com.eventmanagement.backend.dto.request.LoginRequest;
import com.eventmanagement.backend.dto.request.RegisterRequest;
import com.eventmanagement.backend.dto.request.ForgotPasswordRequest;
import com.eventmanagement.backend.dto.request.VerifyOtpRequest;
import com.eventmanagement.backend.dto.request.ResetPasswordRequest;
import com.eventmanagement.backend.dto.response.LoginResponse;
import com.eventmanagement.backend.dto.response.RefreshTokenResponse;
import com.eventmanagement.backend.dto.response.RegisterResponse;
import com.eventmanagement.backend.service.AuthService;
import com.eventmanagement.backend.service.ForgotPasswordService;
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

        @Mock
        private ForgotPasswordService forgotPasswordService;

        @InjectMocks
        private AuthController authController;

        private ObjectMapper objectMapper = new ObjectMapper();

        @BeforeEach
        void setUp() {
                mockMvc = MockMvcBuilders.standaloneSetup(authController)
                                .setControllerAdvice(new com.eventmanagement.backend.exception.GlobalExceptionHandler())
                                .build();
        }

        // ==========================================
        // LOGIN TESTS (LoginRequest Validations)
        // ==========================================

        @Test
        void login_Success() throws Exception {
                LoginRequest req = new LoginRequest();
                req.setEmail("test@example.com");
                req.setPassword("password123");

                LoginResponse.UserInfor userInfo = LoginResponse.UserInfor.builder()
                                .user_id(UUID.randomUUID())
                                .email("test@example.com")
                                .build();

                LoginResponse res = LoginResponse.builder()
                                .accessToken("mockAccessToken")
                                .tokenType("Bearer")
                                .user(userInfo)
                                .build();

                when(authService.login(any(LoginRequest.class), anyString(), any(HttpServletResponse.class)))
                                .thenReturn(res);

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").value("mockAccessToken"));
        }

        @Test
        void login_Failure_NullEmail() throws Exception {
                LoginRequest req = new LoginRequest();
                req.setPassword("password123");

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is required"));
        }

        @Test
        void login_Failure_EmptyEmail() throws Exception {
                LoginRequest req = new LoginRequest();
                req.setEmail("");
                req.setPassword("password123");

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Invalid email format"));
        }

        @Test
        void login_Failure_InvalidEmail() throws Exception {
                LoginRequest req = new LoginRequest();
                req.setEmail("not-an-email");
                req.setPassword("password123");

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Invalid email format"));
        }

        @Test
        void login_Failure_NullPassword() throws Exception {
                LoginRequest req = new LoginRequest();
                req.setEmail("test@example.com");

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value("Password is required"));
        }

        @Test
        void login_Failure_EmptyPassword() throws Exception {
                LoginRequest req = new LoginRequest();
                req.setEmail("test@example.com");
                req.setPassword("");

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value("Password is required"));
        }

        // ==========================================
        // REGISTER TESTS (RegisterRequest Validations)
        // ==========================================

        private RegisterRequest createValidRegisterRequest() {
                RegisterRequest req = new RegisterRequest();
                req.setEmail("valid.user@example.com");
                req.setFullName("Valid User");
                req.setPassword("Str0ngP@ssword!");
                req.setConfirmPassword("Str0ngP@ssword!");
                req.setPhone("0123456789");
                return req;
        }

        @Test
        void register_Success() throws Exception {
                RegisterRequest req = createValidRegisterRequest();

                RegisterResponse res = RegisterResponse.builder()
                                .email(req.getEmail())
                                .message("Registration successful! Please log in to continue.")
                                .build();

                when(authService.register(any(RegisterRequest.class))).thenReturn(res);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.message")
                                                .value("Registration successful! Please log in to continue."));
        }

        @Test
        void register_Failure_NullEmail() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setEmail(null);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is required"));
        }

        @Test
        void register_Failure_InvalidEmail() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setEmail("invalid-email");

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Invalid email format"));
        }

        @Test
        void register_Failure_NullFullName() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setFullName(null);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.fullName").value("Full name is required"));
        }

        @Test
        void register_Failure_TooShortFullName() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setFullName("A"); // Size min = 2

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.fullName")
                                                .value("Full name must be at least 2 characters long"));
        }

        @Test
        void register_Failure_NullPassword() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPassword(null);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value("Password is required"));
        }

        @Test
        void register_Failure_PasswordTooShort() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPassword("Aa1@b"); // Size min = 8

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value(
                                                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"));
        }

        @Test
        void register_Failure_PasswordMissingUppercase() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPassword("abcdefg1@"); // No uppercase

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value(
                                                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"));
        }

        @Test
        void register_Failure_PasswordMissingLowercase() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPassword("ABCDEFG1@"); // No lowercase

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value(
                                                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"));
        }

        @Test
        void register_Failure_PasswordMissingDigit() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPassword("Abcdefgh@"); // No digit

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value(
                                                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"));
        }

        @Test
        void register_Failure_PasswordMissingSpecialChar() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPassword("Abcdefgh1"); // No special character

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.password").value(
                                                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"));
        }

        @Test
        void register_Failure_NullConfirmPassword() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setConfirmPassword(null);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.confirmPassword").value("Confirm password is required"));
        }

        @Test
        void register_Failure_NullPhone() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPhone(null);

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.phone").value("Phone number is required"));
        }

        @Test
        void register_Failure_PhoneTooShort() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPhone("12345"); // Size is exactly 10

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.phone").value("Phone number must be 10 digits long"));
        }

        @Test
        void register_Failure_PhoneTooLong() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPhone("01234567890"); // 11 digits

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.phone").value("Phone number must be 10 digits long"));
        }

        @Test
        void register_Failure_PhoneContainsLetters() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPhone("012345678a"); // Has letter

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.phone").value("Phone number must contain only digits"));
        }

        @Test
        void register_Failure_PhoneContainsSpecialChars() throws Exception {
                RegisterRequest req = createValidRegisterRequest();
                req.setPhone("012-456789"); // Has dash

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.phone").value("Phone number must contain only digits"));
        }

        // ==========================================
        // OTHER TESTS
        // ==========================================

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

                when(authService.loginWithGoogle(any(GoogleLoginRequest.class), anyString(),
                                any(HttpServletResponse.class)))
                                .thenReturn(loginResponse);

                mockMvc.perform(post("/api/auth/google")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(googleRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").value("mockGoogleAccessToken"));
        }

        @Test
        void loginWithGoogle_Failure_NullToken() throws Exception {
                GoogleLoginRequest googleRequest = new GoogleLoginRequest();

                mockMvc.perform(post("/api/auth/google")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(googleRequest)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.googleToken").value("Google token is required"));
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

                when(cookieUtil.getRefreshTokenFromCookie(any()))
                                .thenReturn(java.util.Optional.of("validRefreshToken"));
                when(authService.refreshToken(anyString(), anyString(), any(HttpServletResponse.class)))
                                .thenReturn(tokenResponse);

                mockMvc.perform(post("/api/auth/refresh"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").value("newAccessToken"));
        }

        @Test
        void refreshToken_Failure_NoCookie() throws Exception {
                when(cookieUtil.getRefreshTokenFromCookie(any())).thenReturn(java.util.Optional.empty());

                Exception exception = org.junit.jupiter.api.Assertions.assertThrows(Exception.class, () -> {
                        mockMvc.perform(post("/api/auth/refresh"));
                });

                org.junit.jupiter.api.Assertions.assertTrue(exception.getCause() instanceof RuntimeException);
                org.junit.jupiter.api.Assertions.assertEquals("Refresh token not found",
                                exception.getCause().getMessage());
        }

        // ==========================================
        // FORGOT PASSWORD TESTS (ForgotPasswordRequest Validations)
        // ==========================================

        @Test
        void forgotPassword_Success() throws Exception {
                ForgotPasswordRequest req = new ForgotPasswordRequest();
                req.setEmail("test@example.com");

                mockMvc.perform(post("/api/auth/forgot-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isOk())
                                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content()
                                                .string("OTP sent successfully"));
        }

        @Test
        void forgotPassword_Failure_NullEmail() throws Exception {
                ForgotPasswordRequest req = new ForgotPasswordRequest();

                mockMvc.perform(post("/api/auth/forgot-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is required"));
        }

        @Test
        void forgotPassword_Failure_EmptyEmail() throws Exception {
                ForgotPasswordRequest req = new ForgotPasswordRequest();
                req.setEmail("");

                mockMvc.perform(post("/api/auth/forgot-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is required"));
        }

        @Test
        void forgotPassword_Failure_InvalidEmail() throws Exception {
                ForgotPasswordRequest req = new ForgotPasswordRequest();
                req.setEmail("not-an-email");

                mockMvc.perform(post("/api/auth/forgot-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is not valid"));
        }

        // ==========================================
        // VERIFY OTP TESTS (VerifyOtpRequest Validations)
        // ==========================================

        @Test
        void verifyOtp_Success() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("test@example.com");
                req.setOtp("123456");

                com.eventmanagement.backend.dto.response.VerifyOtpResponse res = com.eventmanagement.backend.dto.response.VerifyOtpResponse
                                .builder()
                                .resetToken("mockResetToken")
                                .build();

                when(forgotPasswordService.verifyOtp(any(VerifyOtpRequest.class))).thenReturn(res);

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resetToken").value("mockResetToken"));
        }

        @Test
        void verifyOtp_Failure_NullEmail() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setOtp("123456");

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is required"));
        }

        @Test
        void verifyOtp_Failure_InvalidEmail() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("abc");
                req.setOtp("123456");

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.email").value("Email is not valid"));
        }

        @Test
        void verifyOtp_Failure_NullOtp() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("test@example.com");

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.otp").value("OTP is required"));
        }

        @Test
        void verifyOtp_Failure_EmptyOtp() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("test@example.com");
                req.setOtp("");

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.otp").value("OTP must be exactly 6 digits"));
        }

        @Test
        void verifyOtp_Failure_OtpTooShort() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("test@example.com");
                req.setOtp("12345"); // 5 digits

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.otp").value("OTP must be exactly 6 digits"));
        }

        @Test
        void verifyOtp_Failure_OtpTooLong() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("test@example.com");
                req.setOtp("1234567"); // 7 digits

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.otp").value("OTP must be exactly 6 digits"));
        }

        @Test
        void verifyOtp_Failure_OtpLetters() throws Exception {
                VerifyOtpRequest req = new VerifyOtpRequest();
                req.setEmail("test@example.com");
                req.setOtp("1234a6"); // Contains letter

                mockMvc.perform(post("/api/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.otp").value("OTP must be exactly 6 digits"));
        }

        // ==========================================
        // RESET PASSWORD TESTS (ResetPasswordRequest Validations)
        // ==========================================

        @Test
        void resetPassword_Success() throws Exception {
                ResetPasswordRequest req = new ResetPasswordRequest();
                req.setResetToken("mockToken");
                req.setNewPassword("Str0ngP@ssword!");
                req.setConfirmPassword("Str0ngP@ssword!");

                mockMvc.perform(post("/api/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isOk())
                                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content()
                                                .string("Password reset successfully"));
        }

        @Test
        void resetPassword_Failure_NullToken() throws Exception {
                ResetPasswordRequest req = new ResetPasswordRequest();
                req.setNewPassword("Str0ngP@ssword!");
                req.setConfirmPassword("Str0ngP@ssword!");

                mockMvc.perform(post("/api/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.resetToken").value("Token is required"));
        }

        @Test
        void resetPassword_Failure_TooShortPassword() throws Exception {
                ResetPasswordRequest req = new ResetPasswordRequest();
                req.setResetToken("mockToken");
                req.setNewPassword("Aa1@b"); // Too short
                req.setConfirmPassword("Aa1@b");

                mockMvc.perform(post("/api/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.newPassword")
                                                .value("Password must be at least 8 characters long"));
        }

        @Test
        void resetPassword_Failure_NoUppercase() throws Exception {
                ResetPasswordRequest req = new ResetPasswordRequest();
                req.setResetToken("mockToken");
                req.setNewPassword("abcdefg1@");
                req.setConfirmPassword("abcdefg1@");

                mockMvc.perform(post("/api/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.newPassword").value(
                                                "Password must contain at least one uppercase letter, one lowercase letter, and one number"));
        }

        @Test
        void resetPassword_Failure_NullConfirmPassword() throws Exception {
                ResetPasswordRequest req = new ResetPasswordRequest();
                req.setResetToken("mockToken");
                req.setNewPassword("Str0ngP@ssword!");

                mockMvc.perform(post("/api/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.confirmPassword").value("Confirm password is required"));
        }
}
