import axiosInstance from "../config/axios";

export const adminService = {

    // ACCOUNT-MANAGEMENT
    getAllAccountsPlain: () => {
        return axiosInstance.get(`/accounts/all`);
    },

    getAllAccounts: (page = 0, size = 10) => {
        return axiosInstance.get(`/accounts`, {
            params: { page, size }
        });
    },

    searchAccounts: (keyword) => {
        return axiosInstance.get(`/accounts/search`, {
            params: { q: keyword }
        })
    },

    getAccountDetail: (id) => {
        return axiosInstance.get(`/accounts/${id}`);
    },

    getEventCount: (id) => {
        return axiosInstance.get(`/accounts/${id}/event-count`);
    },

    updateProfile: (id, data) => {
        return axiosInstance.put(`/accounts/${id}/profile`, data);
    },

    toggleBan: (id) => {
        return axiosInstance.patch(`/accounts/${id}/toggle-ban`);
    },

    createOrganizer: (data) => {
        return axiosInstance.post(`/accounts/organizer`, data);
    },

    checkEmailAvailability: (email) => {
        return axiosInstance.get(`/accounts/check-email`, {
            params: { email }
        });
    },

    // EVENT-MANAGEMENT
    getAllEventsPlain: () => {
        return axiosInstance.get(`/events/all`);
    },

    getAllEvents: (page = 0, size = 10) => {
        return axiosInstance.get(`/events`, {
            params: { page, size }
        });
    },

    getAllCategories: () => {
        return axiosInstance.get(`/events/categories`);
    },

    getEventDetail: (slug) => {
        return axiosInstance.get(`/events/detail/${slug}`);
    },

    getTicketTypes: (slug) => {
        return axiosInstance.get(`/events/${slug}/ticket-types`)
    },

    getEventAgenda: (slug) => {
        return axiosInstance.get(`/events/${slug}/agenda`)
    },

    approveEvent: (slug) => {
        return axiosInstance.patch(`/events/${slug}/approve`)
    },

    rejectEvent: (slug, reason) => {
        return axiosInstance.patch(`/events/${slug}/reject`, { reason })
    },

    getEventAnalytics: () => {
        return axiosInstance.get(`/analytics/events`)
    },

    getSummaryAnalytics: () => {
        return axiosInstance.get(`/analytics/summary`)
    }

};