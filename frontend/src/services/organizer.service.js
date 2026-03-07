import axiosInstance from "../config/axios";

export const organizerService = {

    // STAFF-MANAGEMENT
    getEventStaff: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/staff`);
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