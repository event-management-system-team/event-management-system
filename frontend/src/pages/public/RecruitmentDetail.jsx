import HeroSection from '../../components/domain/recruitment-detail/HeroSection';
import DescriptionSection from '../../components/domain/recruitment-detail/DescriptionSection';
import ApplySection from '../../components/domain/recruitment-detail/ApplySection';
import OrganizerCard from '../../components/common/attendee/OrganizerCard'
import BenefitSection from '../../components/domain/recruitment-detail/BenefitSection';
import { useParams } from 'react-router';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import useRecruitmentDetail from '../../hooks/useRecruitmentDetail';


const RecruitmentDetailPage = () => {

    const { eventSlug } = useParams();
    const { data: recruitment, isLoading, isError } = useRecruitmentDetail(eventSlug);


    const deadlineDate = recruitment?.deadline ? new Date(recruitment.deadline) : null;

    const formattedDeadline = deadlineDate
        ? deadlineDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Open until filled';

    const daysLeft = deadlineDate
        ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

    const totalVacancy = recruitment?.positions?.reduce((sum, pos) => sum + pos.vacancy, 0);
    const totalAvailable = recruitment?.positions?.reduce((sum, pos) => sum + pos.availableSlots, 0);
    const filledPercentage = totalVacancy > 0 ? ((totalVacancy - totalAvailable) / totalVacancy) * 100 : 0;

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError || !recruitment) {
        return <EmptyState message="Not Found Job" />;
    }

    return (
        <div className="bg-background-light font-sans text-slate-900 min-h-screen">

            <HeroSection
                eventBannerUrl={recruitment?.eventBannerUrl}
                eventName={recruitment?.eventName}
                totalVacancy={totalVacancy} />

            <main className="max-w-[1200px] mx-auto px-6 -mt-12 relative z-20 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="flex-1 space-y-8">

                        <BenefitSection
                            benefits={recruitment?.benefits} />

                        <DescriptionSection
                            description={recruitment?.description}
                            positions={recruitment?.positions} />
                    </div>

                    <aside className="w-full lg:w-90">
                        <div className="sticky top-28 space-y-6">

                            <ApplySection
                                status={recruitment.status}
                                formattedDeadline={formattedDeadline}
                                filledPercentage={filledPercentage}
                                daysLeft={daysLeft}
                                totalAvailable={totalAvailable}
                                totalVacancy={totalVacancy}
                                deadlineDate={deadlineDate}
                                location={recruitment.location} />

                            <OrganizerCard
                                events={recruitment} />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default RecruitmentDetailPage;