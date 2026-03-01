
import axiosInstance from '../config/axios'
const recruitmentService = {
    getRecentRecruitment: async () => {
        const response = await axiosInstance.get("/recruitments/recent")
        return response.data
    },
    searchRecruitment: async (filters) => {
        const params = new URLSearchParams();
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.location) params.append('location', filters.location);
        if (filters.deadline) params.append('deadline', filters.deadline);
        if (filters.page !== undefined && filters.page !== null) params.append('page', filters.page);
        if (filters.size !== undefined && filters.size !== null) params.append('size', filters.size);

        const response = await axiosInstance.get(`/recruitments/search?${params.toString()}`)
        return response.data
    },
    getRecruitmentDetail: async (eventSlug) => {
        const response = await axiosInstance.get(`/recruitments/${eventSlug}`)
        return response.data
    }
}


export default recruitmentService
