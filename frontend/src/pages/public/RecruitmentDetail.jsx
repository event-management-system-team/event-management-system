import {
    ShieldCheck,
    GraduationCap,
    Award,
} from 'lucide-react';
import HeroSection from '../../components/domain/recruitment-detail/HeroSection';
import DescriptionSection from '../../components/domain/recruitment-detail/DescriptionSection';
import ApplySection from '../../components/domain/recruitment-detail/ApplySection';
import OrganizerCard from '../../components/common/attendee/OrganizerCard'
import recruitmentService from '../../services/recruitment.service'
import BenefitSection from '../../components/domain/recruitment-detail/BenefitSection';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

const mockData = {
    "eventId": "e0000000-0000-0000-0000-000000000001",
    "eventSlug": "vietnam-ai-summit-2026",
    "eventName": "Vietnam AI Summit 2026",
    "eventBannerUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    "location": "Landmark 81, HCM",
    "description": "Chịu trách nhiệm thiết lập và điều phối hệ thống âm thanh, ánh sáng sân khấu trong suốt thời gian diễn ra sự kiện âm nhạc. Hỗ trợ ban tổ chức trong việc đón tiếp khách mời và xử lý các vấn đề kỹ thuật phát sinh.",
    "deadline": "2026-03-15T23:59:59",
    "createdAt": "2026-02-23T04:22:29.402584",
    "status": "OPEN",
    "positions": [
        {
            "recruitmentId": "b103cb11-836c-4833-aaa9-e2c5388ffc85",
            "positionName": "Chuyên viên Điều phối Âm thanh Ánh sáng",
            "vacancy": 5,
            "availableSlots": 1,
            "requirements": "Kinh nghiệm 2 năm làm việc với mixer digital. Chịu được áp lực cao."
        },
        {
            "recruitmentId": "f0000000-0000-0000-0000-000000000001",
            "positionName": "Lễ tân / Check-in",
            "vacancy": 5,
            "availableSlots": 5,
            "requirements": "Tiếng Anh giao tiếp tốt."
        },
        {
            "recruitmentId": "f0000000-0000-0000-0000-000000000002",
            "positionName": "Hỗ trợ kỹ thuật",
            "vacancy": 2,
            "availableSlots": 2,
            "requirements": "Sinh viên IT năm 3-4."
        }
    ],
    "organizer": {
        "userId": "11111111-1111-1111-1111-111111111111",
        "fullName": "Tech Corp Vietnam",
        "avatarUrl": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
        "email": "tech.org@test.com"
    }
};

const RecruitmentDetailPage = () => {

    const { eventSlug } = useParams();
    const { data: recruitment, isLoading, isError } = useQuery({
        queryKey: ['recruitment', eventSlug],
        queryFn: () => recruitmentService.getRecruitmentDetail(eventSlug),
        enabled: !!eventSlug,
    })


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