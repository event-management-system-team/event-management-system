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
    searchEvents: async (filters) => {
        const params = new URLSearchParams();
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.location) params.append('location', filters.location);
        if (filters.date) params.append('date', filters.date);
        if (filters.category) params.append('category', filters.category);
        if (filters.price) params.append('price', filters.price);

        const response = await axiosInstance.get(`events/search?${params.toString()}`)
        return response.data
    }
}

export default eventService
