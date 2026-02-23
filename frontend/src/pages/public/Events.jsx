import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"
import eventService from '../../services/event.service';
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'

const EventsPage = () => {

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || ''
    const location = searchParams.get('location') || ''

    const { data, isLoading, isError } = useQuery({
        queryKey: ['events', 'search', keyword, location],
        queryFn: () => eventService.searchEvents(keyword, location),
    })

    const events = data?.content || []

    const isEmpty = isError || events.length === 0

    return (
        <>
            {isLoading ? (
                <LoadingState className="h-[500px]" />
            )
                : isEmpty ? (
                    <EmptyState className="h-[500px]" message="No events found" />
                )
                    :
                    <>
                        EventsPage
                    </>
            }
        </>
    )
}

export default EventsPage