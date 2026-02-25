import { useRef } from 'react';
import LoadingState from '../../common/LoadingState'
import EmptyState from '../../common/EmptyState'
import EventCard from '../../common/EventCard'
import { Pagination } from "antd";


const EventList = ({ events, data, isLoading, isEmpty, searchParams, setSearchParams }) => {

    const listTopRef = useRef(null);

    const pageNumber = (data?.number || 0) + 1
    const pageSize = data?.size || 6
    const totalElements = data?.totalElements || 6

    const onChange = (page) => {
        const springBootPage = page - 1;

        searchParams.set('page', springBootPage);
        setSearchParams(searchParams);

        // Xóa focus hiện tại khỏi nút vừa bấm
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Delay 100ms chờ giao diện Loading hiện ra ổn định rồi mới cuộn mượt lên cọc
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
            )
                : isEmpty ? (
                    <EmptyState className="h-[500px]" message="No events found" />
                )
                    :
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard key={event.eventId} {...event} />
                        ))

                        }
                    </div>
            }

            <div className="mt-16 mb-8 flex justify-center w-full">
                <Pagination
                    align="center"
                    responsive
                    current={pageNumber}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    total={totalElements}
                    onChange={(page) => { onChange(page) }} />
            </div>

        </div>
    )
}

export default EventList
