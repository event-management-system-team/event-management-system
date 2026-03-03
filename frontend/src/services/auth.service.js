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

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  sendOTP: async (email) => {
    const response = await axiosInstance.post(
      "/auth/forgot-password",
      {
        email,
      },
    );
    return response.data;
  },

  verifyOTP: async (email, otpCode) => {
    const response = await axiosInstance.post(
      "/auth/verify-otp",
      {
        email,
        otp: otpCode,
      },
    );
    return response.data;
  },

  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  saveUser: (user, rememberMe = false) => {
    const userStr = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem("user", userStr);
      localStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.setItem("user", userStr);
      localStorage.removeItem("rememberMe");
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
    localStorage.removeItem("rememberMe");
  },

  isAuthenticated: () => {
    const hasUser =
      !!localStorage.getItem("user") || !!sessionStorage.getItem("user");
    return hasUser;
  },

  isRememberMe: () => {
    return localStorage.getItem("rememberMe") === "true";
  },
};

export default authService;
