import { useRef } from 'react';
import LoadingState from '../../common/LoadingState'
import EmptyState from '../../common/EmptyState'
import RecruitmentCard from '../../common/RecruitmentCard'
import { Pagination } from "antd";


const RecruitmentList = ({ recruitmentList, data, isLoading, isEmpty, searchParams, setSearchParams }) => {

    const listTopRef = useRef(null);

    const pageNumber = (data?.number || 0) + 1
    const pageSize = data?.size || 6
    const totalElements = data?.totalElements || 6

    const onChange = (page) => {
        const springBootPage = page - 1;

        searchParams.set('page', springBootPage);
        setSearchParams(searchParams);

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        setTimeout(() => {
            if (listTopRef.current) {
                listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    return (
        <div className="flex-1 scroll-mt-24" ref={listTopRef}>
            {isLoading ? (
                <LoadingState className="h-[500px]" />
            ) : isEmpty ? (
                <EmptyState className="h-[500px]" message="No jobs found" />
            ) : (
                <div className="flex flex-col gap-4 sm:gap-6">
                    {recruitmentList.map((recruitment) => (
                        <RecruitmentCard key={recruitment.eventId} {...recruitment} />
                    ))}
                </div>
            )}

            <div className="mt-16 mb-8 flex justify-center w-full">
                <Pagination
                    align="center"
                    responsive
                    current={pageNumber}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    total={totalElements}
                    onChange={(page) => { onChange(page) }}
                />
            </div>
        </div>
    )
}

export default RecruitmentList
