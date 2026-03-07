import axiosInstance from "../config/axios";

export const organizerService = {

    // STAFF-MANAGEMENT
    getEventStaffPlain: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/staff/all`);
    },

    getEventStaff: (eventId, page = 0, size = 10) => {
        return axiosInstance.get(`/events/${eventId}/staff`, {
            params: { page, size }
        });
    },

    getStaffAssignment: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments`);
    },

    getStaffAssignmentByRole: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments/by-role`);
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

    createSchedule: (eventId, data) => {
        return axiosInstance.post(`/events/${eventId}/schedules`, data)
    },


};