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

    getStaffAssignmentByRole: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/assignments/by-role`);
    },

    getMyEvents: async (organizerId, page = 0, size = 5) => {
        const response = await axiosInstance.get('/organizer/events', {
            params: { organizerId, page, size }
        })
        return response.data
    },

    getMyEventStats: async (organizerId) => {
        const response = await axiosInstance.get('/organizer/events/stats', {
            params: { organizerId }
        })
        return response.data
    },

    createEvent: async (eventData, coverFile) => {
        const formData = new FormData()

        formData.append('event', new Blob([JSON.stringify(eventData)], { type: 'application/json' }))

        if (coverFile) {
            formData.append('coverFile', coverFile)
        }

        const response = await axiosInstance.post('/organizer/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000,
        })
        return response.data
    },

    getEventById: async (eventId) => {
        const response = await axiosInstance.get(`/organizer/events/${eventId}`)
        return response.data
    },

    deleteEvent: async (eventId) => {
        const response = await axiosInstance.delete(`/organizer/events/${eventId}`)
        return response.data
    },

    updateEvent: async (eventId, eventData, coverFile) => {
        const formData = new FormData()

        formData.append('event', new Blob([JSON.stringify(eventData)], { type: 'application/json' }))

        if (coverFile) {
            formData.append('coverFile', coverFile)
        }

        const response = await axiosInstance.put(`/organizer/events/${eventId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000,
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

    createResource: (eventId, data, file) => {
        const formData = new FormData()

        formData.append(
            "data",
            JSON.stringify({
                resourceName: data.resourceName,
                description: data.description,
                resourceType: data.resourceType
            })
        )

        formData.append("file", file)

        return axiosInstance.post(
            `/events/${eventId}/resources`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
    },

    getResources: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/resources`)
    }
}

export default organizerService;
