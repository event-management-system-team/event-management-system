import axiosInstance from "../config/axios";

export const organizerService = {

    // STAFF-MANAGEMENT
    getEventStaff: (id) => {
        return axiosInstance.get(`/events/${id}/staff`);
    },

    getStaffAssignment: (eventId, staffId) => {
        return axiosInstance.get(`/events/${eventId}/staffs/${staffId}`);
    },

    getAssignment: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments`);
    },
};