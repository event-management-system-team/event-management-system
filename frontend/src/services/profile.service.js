import axiosInstance from "../config/axios";

const profileService = {
  getMyProfile: async () => {
    const response = await axiosInstance.get("/profile/me");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put("/profile/me", profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosInstance.post(
      "/profile/change-password",
      passwordData,
    );
    return response.data;
  },
};

export default profileService;
