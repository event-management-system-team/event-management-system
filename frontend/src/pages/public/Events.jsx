import { useSearchParams } from "react-router-dom"
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import useFetchEventSearch from "../../hooks/useFetchEventSearch";
import SidebarFilter from "../../components/domain/events/SidebarFilter";
import HeroBanner from "../../components/domain/events/HeroBanner";
import EventList from "../../components/domain/events/EventList";

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
            <div className="bg-background-light min-h-screen font-display">
                <HeroBanner />

                <main className="max-w-[1400px] mx-auto px-6 py-12">

                    <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 font-medium">
                        <a href="/" className="hover:text-primary">Home</a>
                        {/* <span className="material-symbols-outlined text-xs">chevron_right</span> */}
                        <span className="text-gray-900 font-bold">Events</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <SidebarFilter />
                        <EventList />
                    </div>

                </main>

            </div>
        </>
    )
}

export default EventsPage