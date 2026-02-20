import axiosInstance from '../config/axios'

const eventService = {
    getTopFeaturedEvents: async () => {
        const response = await axiosInstance.get('/events/featured')
        return response.data
    },
    getTopHotEvents: async () => {
        const response = await axiosInstance.get('/events/hot')
        return response.data
    }
}

export default eventService
