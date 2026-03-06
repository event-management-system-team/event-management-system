import axiosInstance from "../config/axios";

export const organizerService = {

    // STAFF-MANAGEMENT
    getEventStaff: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/staff`);
    },

    getStaffAssignment: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments`);
    },

    getStaffRoleList: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/role`)
    },

    getRoleStats: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/role-stats`)
    },

    getStaffByRole: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/staff`)
    },


};