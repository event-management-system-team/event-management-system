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
}

export default organizerService
