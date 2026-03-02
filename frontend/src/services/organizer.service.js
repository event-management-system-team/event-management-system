import axiosInstance from '../config/axios'

const organizerService = {
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
    }
}

export default organizerService
