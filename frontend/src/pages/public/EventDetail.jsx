import HeroSection from "../../components/domain/event-detail/HeroSection"
import ContentLeft from "../../components/domain/event-detail/ContentLeft"
import SidebarTicket from "../../components/domain/event-detail/SidebarTicket"
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import eventService from "../../services/event.service"
import OrganizerCard from "../../components/common/attendee/OrganizerCard"

const EventDetailPage = () => {

    const { eventSlug } = useParams();
    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['events', eventSlug],
        queryFn: () => eventService.getEventBySlug(eventSlug),
        enabled: !!eventSlug,
    })

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError || !events) {
        return <EmptyState message="Not Found Event" />;
    }
    return (
        <>

            <HeroSection
                bannerUrl={events?.bannerUrl}
                location={events?.location}
                eventName={events?.eventName}
                startDate={events?.startDate}
                endDate={events?.endDate}
                category={events?.category}
            />

            <div className="w-full bg-background-light">
                <main className="max-w-300 mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 ">

                    <ContentLeft
                        eventName={events?.eventName}
                        description={events.description}
                        imageGallery={events.imageGallery}
                        locationCoordinates={events.locationCoordinates}
                        metadata={events.metadata}
                        agendas={events.agendas}
                        ticketTypes={events.ticketTypes}
                    />

                    <aside className="w-full lg:w-95 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <SidebarTicket
                                minPrice={events?.minPrice}
                                ticketTypes={events?.ticketTypes}
                                totalCapacity={events?.totalCapacity}
                            />

                            <OrganizerCard events={events} />
                        </div>
                    </aside>
                </main>
            </div>

        </>
    )
}

export default EventDetailPage

