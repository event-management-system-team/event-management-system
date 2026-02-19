import axiosInstance from '../config/axios'

const eventService = {
    getTopNewEvents: async () => {
        const response = await axiosInstance.get('/events/featured')
        return response.data
    },
}

export default eventService
