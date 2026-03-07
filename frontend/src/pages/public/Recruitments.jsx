import { useQuery } from '@tanstack/react-query';

import recruitmentService from '../../services/recruitment.service'
import { useSearchParams } from 'react-router';
import HeroBanner from '../../components/domain/recruitments/HeroBanner';
import useFilterRecruitment from '../../hooks/useFilterRecruitment'
import DynamicBreadcrumb from '../../components/common/DynamicBreadcrumb';
import SidebarFilter from '../../components/domain/recruitments/SidebarFilter';
import { Filter } from 'lucide-react';
import RecruitmentList from '../../components/domain/recruitments/RecruitmentList';

const RecruitmentPage = () => {

    const formatdeadline = (deadlineString) => {
        const deadline = new deadline(deadlineString);
        return deadline.toLocaledeadlineString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        deadline: searchParams.get('deadline') || '',

        page: parseInt(searchParams.get('page')) || 0,
        size: 6,
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ['recruitments', 'search', filters],
        queryFn: () => recruitmentService.searchRecruitment(filters)
    })

    const recruitmentList = data?.content || []
    const isEmpty = isError || recruitmentList.length === 0

    const filterControls = useFilterRecruitment({ initialValues: filters, searchParams, setSearchParams });

    return (
        <div className="bg-background-light min-h-screen font-display">
            <HeroBanner
                keyword={filterControls.keyword}
                setKeyword={filterControls.setKeyword}
                handleSearch={filterControls.handleSearch}
                handleKeyDown={filterControls.handleKeyDown} />

            <main className="max-w-[1400px] mx-auto px-6 py-12">

                <DynamicBreadcrumb />

                <div className="flex justify-between items-center mb-2 px-2">

                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Filter className="w-3.5 h-3.5" strokeWidth={3} />
                        <h3 className="text-[13px] font-bold uppercase tracking-widest">
                            Filters
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    <SidebarFilter
                        deadline={filterControls.deadline}
                        setDeadline={filterControls.setDeadline}
                        location={filterControls.location}
                        setLocation={filterControls.setLocation}
                        handleApply={filterControls.handleApply}
                        handleReset={filterControls.handleReset} />
                    <RecruitmentList
                        recruitmentList={recruitmentList}
                        data={data}
                        isLoading={isLoading}
                        isEmpty={isEmpty}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams} />
                </div>

            </main>

        </div>
    );
};

export default RecruitmentPage;