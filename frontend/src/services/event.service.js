import axios from 'axios'
import axiosInstance from '../config/axios'

const eventService = {
    getTopFeaturedEvents: async () => {
        const response = await axiosInstance.get('/events/featured')
        return response.data
    },
    getTopHotEvents: async () => {
        const response = await axiosInstance.get('/events/hot')
        return response.data
    },
    getProvinces: async () => {
        const response = await axios.get('https://provinces.open-api.vn/api/v2/')
        return response.data
    },
    searchEvents: async (keyword, location) => {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);

        const response = await axiosInstance.get(`events/search?${params.toString()}`)
        return response.data
    }
}

export default eventService
