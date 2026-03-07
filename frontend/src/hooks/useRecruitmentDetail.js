import recruitmentService from '../services/recruitment.service'
import { useQuery } from '@tanstack/react-query'
const useRecruitmentDetail = (eventSlug) => {
    return useQuery({
        queryKey: ['recruitment', eventSlug],
        queryFn: () => recruitmentService.getRecruitmentDetail(eventSlug),
        enabled: !!eventSlug,
    })
}

export default useRecruitmentDetail
