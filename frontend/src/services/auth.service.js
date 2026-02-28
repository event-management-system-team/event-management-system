import axiosInstance from "../config/axios";

const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  loginWithGoogle: async (googleToken) => {
    const response = await axiosInstance.post("/auth/google", {
      googleToken: googleToken,
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },

  sendForgotPasswordEmail: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  verifyOtp: async ({ email, otp }) => {
    const response = await axiosInstance.post("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async ({ resetToken, newPassword, confirmPassword }) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  saveAccessToken: (accessToken, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.setItem("accessToken", accessToken);
      localStorage.removeItem("rememberMe");
    }
  },

  getAccessToken: () => {
    return (
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    );
  },

  saveUser: (user, rememberMe) => {
    const userStr = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem("user", userStr);
    } else {
      sessionStorage.setItem("user", userStr);
    }
  },

  getUser: () => {
    const userStr =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  clearSession: () => {
    sessionStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("rememberMe");
  },

  isAuthenticated: () => {
    const hasToken =
      !!localStorage.getItem("accessToken") ||
      !!sessionStorage.getItem("accessToken");
    const hasUser =
      !!localStorage.getItem("user") || !!sessionStorage.getItem("user");
    return hasToken && hasUser;
  },

  isRememberMe: () => {
    return localStorage.getItem("rememberMe") === "true";
  },
};

export default authService;
