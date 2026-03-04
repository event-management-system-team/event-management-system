import axiosInstance from '../config/axios'

const staffService = {
    getWorkspace: async (eventSlug) => {
        const response = await axiosInstance.get(`/staff/${eventSlug}`)
        return response.data
    }
}


export default staffService
