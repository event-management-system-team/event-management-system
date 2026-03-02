import axiosInstance from '../config/axios'

const applicationService = {
    getApplications: async () => {
        const response = await axiosInstance.get(`/applications`)
        return response.data
    },
}


export default applicationService
