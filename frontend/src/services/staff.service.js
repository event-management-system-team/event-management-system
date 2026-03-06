import axiosInstance from '../config/axios'

const staffService = {
    getWorkspace: async (eventSlug) => {
        const response = await axiosInstance.get(`/staff/${eventSlug}`)
        return response.data
    },
    searchEventTickets: async (eventSlug, keyword) => {
        const params = new URLSearchParams();

        if (keyword) params.append('keyword', keyword);
        const response = await axiosInstance.get(`/staff/${eventSlug}/ticket-list?${params.toString()}`)
        return response.data
    }
}


export default staffService
