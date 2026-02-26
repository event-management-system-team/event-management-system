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
        if (filters.categories) params.append('categories', filters.categories);
        if (filters.price !== undefined && filters.price !== '') params.append('price', filters.price);
        if (filters.isFree) params.append('isFree', filters.isFree);
        if (filters.page !== undefined && filters.page !== null) params.append('page', filters.page);
        if (filters.size !== undefined && filters.size !== null) params.append('size', filters.size);

        const response = await axiosInstance.get(`events/search?${params.toString()}`)
        return response.data
    }
}

export default eventService
