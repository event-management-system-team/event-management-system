import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Register failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      const rememberMe = credentials.rememberMe || false;
      authService.saveAccessToken(data.accessToken, rememberMe);
      authService.saveUser(data.user, rememberMe);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (googleToken, { rejectWithValue }) => {
    try {
      const data = await authService.loginWithGoogle(googleToken);
      authService.saveAccessToken(data.accessToken);
      authService.saveUser(data.user);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login with Google failed",
      );
    }
  },
);

export const autoRefreshToken = createAsyncThunk(
  "auth/autoRefresh",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.refreshToken();
      const rememberMe = authService.isRememberMe();
      authService.saveAccessToken(data.accessToken, rememberMe);
      if (data.user) {
        authService.saveUser(data.user, rememberMe);
      }

      return data;
    } catch {
      authService.clearSession();
      return rejectWithValue("Session expired");
    }
  },
);

export const sendForgotPasswordEmail = createAsyncThunk(
  "auth/forgot-password",
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.sendForgotPasswordEmail(email);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email sending failed",
      );
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOtp({ email, otp });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ resetToken, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword({ resetToken, newPassword, confirmPassword });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      authService.clearSession();
    } catch (error) {
      authService.clearSession();
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

const initialState = {
  user: authService.getUser(),
  accessToken: authService.getAccessToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      authService.saveAccessToken(action.payload, authService.isRememberMe());
    },
    setUser: (state, action) => {
      state.user = action.payload;
      authService.saveUser(action.payload, authService.isRememberMe());
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(autoRefreshToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        // Restore user from payload if available, else fallback to localStorage
        if (action.payload.user) {
          state.user = action.payload.user;
        } else {
          state.user = authService.getUser();
        }
      })
      .addCase(autoRefreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })

      // Forgot password
      .addCase(sendForgotPasswordEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendForgotPasswordEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearRegisterSuccess, setAccessToken, setUser } =
  authSlice.actions;
export default authSlice.reducer;
