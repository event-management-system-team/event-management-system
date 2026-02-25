import recruitmentService from '../../../services/recruitment.service'
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import RecruitmentCard from "../../common/RecruitmentCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
const RecruitmentRight = () => {

  const { data: recruitments, isLoading, isError } = useQuery({
    queryKey: ['recruitments', 'recent'],
    queryFn: () => recruitmentService.getRecentRecruitment()
  })

  const isEmpty = isError || !recruitments || recruitments.length === 0


  return (
    <div className="lg:col-span-7 grid gap-5">

      {isLoading ? (
        <LoadingState />
      ) : isEmpty ? (
        <EmptyState />
      ) :
        (
          recruitments.map((recruitment) => (
            <RecruitmentCard key={recruitment.recruitmentId} {...recruitment} />
          ))
        )
      }


      <p className="text-center text-sm text-gray-500 mt-2 font-medium">
        Thinking about joining? <Link to="/recruitments" className="text-primary hover:underline">View 150+ open positions</Link>
      </p>
    </div>
  )
}

export default RecruitmentRight
