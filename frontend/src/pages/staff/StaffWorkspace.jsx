import { ScanLine } from 'lucide-react';
import ProfileCard from '../../components/domain/staff/workspace/ProfileCard';
import EventBannerCard from '../../components/domain/staff/workspace/EventBannerCard';
import ScheduleWidget from '../../components/domain/staff/workspace/ScheduleWidget';
import ResourcesWidget from '../../components/domain/staff/workspace/ResourcesWidget';
import { useQuery } from '@tanstack/react-query'
import staffService from '../../services/staff.service'
import { useNavigate, useParams } from 'react-router';
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'

const StaffWorkspacePage = () => {

    const { eventSlug } = useParams()
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['workspace', eventSlug],
        queryFn: () => staffService.getWorkspace(eventSlug),
        enabled: !!eventSlug
    })

    if (isLoading) return <LoadingState />
    if (isError || !data) return <EmptyState className='h-[600px]' />


    const schedules = data?.schedules?.slice(0, 2) || [];
    const resources = data?.resources?.slice(0, 2) || [];
    const staffRole = data?.staffRole?.toLowerCase() || '';
    const isCheckInStaff = staffRole.includes('check-in') || staffRole.includes('check in');


    return (

        <div className="h-screen w-full bg-[#F3F4F6] font-sans overflow-hidden flex flex-col relative">

            <div className="w-full h-full overflow-y-auto custom-scrollbar">

                <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 p-4 lg:p-6 pb-24 lg:pb-10">

                    <div className="flex-none flex flex-col lg:flex-row gap-6">
                        <ProfileCard
                            userInfo={data?.userInfo}
                            staffRole={data?.staffRole} />

                        <EventBannerCard
                            eventInfo={data?.eventInfo}
                        />
                    </div>

                    <div className="flex-none flex flex-col lg:flex-row gap-6">
                        <ScheduleWidget
                            schedules={schedules} />

                        <ResourcesWidget
                            resources={resources} />

                    </div>
                </div>
            </div>

            {isCheckInStaff && (
                <button className="fixed bottom-6 lg:bottom-8 right-6 lg:right-8 z-50 flex items-center justify-center size-14 lg:size-16 rounded-[1.5rem] bg-gradient-to-tr from-[#89A8B2] to-[#608b99] text-white shadow-[0_10px_25px_rgba(137,168,178,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_35px_rgba(137,168,178,0.6)]"
                    onClick={() => navigate(`/staff/${eventSlug}/scan-qr`)}>
                    <ScanLine size={24} className="lg:w-7 lg:h-7" />
                </button>
            )}
        </div>
    );
};

export default StaffWorkspacePage;

