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

  saveAccessToken: (accessToken) => {
    sessionStorage.setItem("accessToken", accessToken);
  },

  getAccessToken: () => {
    return sessionStorage.getItem("accessToken");
  },

  saveUser: (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    const userStr = sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  clearSession: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem("accessToken");
  },
};

export default authService;
