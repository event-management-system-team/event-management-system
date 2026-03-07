import axiosInstance from "../config/axios";

const organizerService = {

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

    getMyEvents: async (organizerId, page = 0, size = 5) => {
        const response = await axiosInstance.get('/organizer/events', {
            params: { organizerId, page, size }
        })
        return response.data
    },

    getStaffAssignmentByRole: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments/by-role`);
    },
    getMyEventStats: async (organizerId) => {
        const response = await axiosInstance.get('/organizer/events/stats', {
            params: { organizerId }
        })
        return response.data
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

export default organizerService;