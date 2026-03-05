import axiosInstance from "../config/axios";

export const organizerService = {

    // STAFF-MANAGEMENT
    getEventStaff: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/staff`);
    },

    getStaffAssignment: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments`);
    },
};