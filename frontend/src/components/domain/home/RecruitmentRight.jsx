import recruitmentService from '../../../services/recruitment.service'
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import RecruitmentCard from "../../common/RecruitmentCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const RecruitmentRight = () => {

  const { t } = useTranslation();
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
            <RecruitmentCard key={recruitment.eventId} {...recruitment} />
          ))
        )
      }


      <p className="text-center text-sm text-gray-500 mt-2 font-medium">
        {t("thinking_about_joining")} <Link to="/recruitments" className="text-primary hover:underline">{t("view_open_positions")}</Link>
      </p>
    </div>
  )
}

export default RecruitmentRight
