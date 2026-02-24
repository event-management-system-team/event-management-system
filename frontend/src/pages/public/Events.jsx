import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import useFetchEventSearch from "../../hooks/useFetchEventSearch";

const EventsPage = () => {

    const [searchParams] = useSearchParams();
    const filters = {
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        date: searchParams.get('date') || '',
        category: searchParams.get('category') || '',
        price: searchParams.get('price') || '',
    }

    const { data, isLoading, isError } = useFetchEventSearch(filters);

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