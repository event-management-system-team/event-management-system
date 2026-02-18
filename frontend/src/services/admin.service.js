import axiosInstance from "../config/axios";

export const adminService = {
    // get account list with pagination
//  getAllAccounts: (page = 0, size = 10) => {
//    return axiosInstance.get(`/admin/accounts`, {
//      params: { page, size }
//    });
//  },

    getAllAccounts: () => {
        return axiosInstance.get(`/admin/accounts`);
    },
};