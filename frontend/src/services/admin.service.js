import axiosInstance from "../config/axios";

export const adminService = {

    // ACCOUNT-MANAGEMENT
    getAllAccountsPlain: () => {
        return axiosInstance.get(`/admin/accounts/all`);
    },

    getAllAccounts: (page = 0, size = 10) => {
        return axiosInstance.get(`/admin/accounts`, {
            params: { page, size }
        });
    },

    searchAccounts: (keyword) => {
        return axiosInstance.get(`/admin/accounts/search`, {
            params: { q: keyword }
        })
    },

    getAccountDetail: (id) => {
        return axiosInstance.get(`/admin/accounts/${id}`);
    },

    getEventCount: (id) => {
        return axiosInstance.get(`/admin/accounts/${id}/event-count`);
    },

    updateProfile: (id, data) => {
        return axiosInstance.put(`/admin/accounts/${id}/profile`, data);
    },

    toggleBan: (id) => {
        return axiosInstance.patch(`/admin/accounts/${id}/toggle-ban`);
    },

    createOrganizer: (data) => {
        return axiosInstance.post(`/admin/accounts/organizer`, data);
    },

    checkEmailAvailability: (email) => {
        return axiosInstance.get(`/admin/accounts/check-email`, {
            params: { email }
        });
    },

    // EVENT-MANAGEMENT
    getAllEventsPlain: () => {
        return axiosInstance.get(`/admin/events/all`);
    },

    getAllEvents: (page = 0, size = 10) => {
        return axiosInstance.get(`/admin/events`, {
            params: { page, size }
        });
    },

    getAllCategories: () => {
        return axiosInstance.get(`/admin/events/categories`);
    },

    getEventDetail: (id) => {
        return axiosInstance.get(`/admin/events/${id}`);
    },

    getTicketTypes: (id) => {
        return axiosInstance.get(`/admin/events/${id}/ticket-types`)
    },

    getEventAgenda: (id) => {
        return axiosInstance.get(`/admin/events/${id}/agenda`)
    },

};