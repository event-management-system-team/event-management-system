
import axiosInstance from '../config/axios'
const recruitmentService = {
    getRecentRecruitment: async () => {
        const response = await axiosInstance.get("recruitments/recent")
        return response.data
    }
}


export default recruitmentService
