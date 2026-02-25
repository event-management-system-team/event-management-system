import SidebarFilter from "../../components/domain/events/SidebarFilter";
import HeroBanner from "../../components/domain/events/HeroBanner";
import EventList from "../../components/domain/events/EventList";
import { useSearchParams } from "react-router-dom";
import useFetchEventSearch from "../../hooks/useFetchEventSearch";
import useFilterEvents from '../../hooks/useFilterEvents'
import { Filter } from "lucide-react";

const EventsPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        date: searchParams.get('date') || '',
        categories: searchParams.get('categories') || '',
        price: searchParams.get('price') || '',
        isFree: searchParams.get('isFree') === 'true',

        page: parseInt(searchParams.get('page')) || 0,
        size: 6,
    }

    const { data, isLoading, isError } = useFetchEventSearch(filters);

    const events = data?.content || []
    const isEmpty = isError || events.length === 0

    const filterControls = useFilterEvents({ initialValues: filters, searchParams, setSearchParams });

    return (
        <>
            <div className="bg-background-light min-h-screen font-display">
                <HeroBanner
                    keyword={filterControls.keyword}
                    setKeyword={filterControls.setKeyword}
                    location={filterControls.location}
                    setLocation={filterControls.setLocation}
                    handleSearch={filterControls.handleSearch}
                    handleKeyDown={filterControls.handleKeyDown} />

                <main className="max-w-[1400px] mx-auto px-6 py-12">

                    <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 font-medium">
                        <a href="/" className="hover:text-primary">Home</a>
                        {/* <span className="material-symbols-outlined text-xs">chevron_right</span> */}
                        <span className="text-gray-900 font-bold">Events</span>
                    </div>


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
                            date={filterControls.date}
                            setDate={filterControls.setDate}
                            categories={filterControls.categories}
                            setCategories={filterControls.setCategories}
                            price={filterControls.price}
                            setPrice={filterControls.setPrice}
                            isFree={filterControls.isFree}
                            setIsFree={filterControls.setIsFree}
                            handleApply={filterControls.handleApply}
                            handleReset={filterControls.handleReset} />
                        <EventList
                            events={events}
                            data={data}
                            isLoading={isLoading}
                            isEmpty={isEmpty}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams} />
                    </div>

                </main>

            </div>
        </>
    )
}

export default EventsPage