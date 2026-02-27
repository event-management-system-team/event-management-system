import HeroSection from "../../components/domain/event-detail/HeroSection"
import ContentLeft from "../../components/domain/event-detail/ContentLeft"
import SidebarTicket from "../../components/domain/event-detail/SidebarTicket"
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import eventService from "../../services/event.service"
import { Star } from "lucide-react"

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

                            {/* Organizer */}
                            <div className="bg-white p-6 rounded-3xl border border-[#E5E1DA]">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Organizer</h5>
                                <div className="flex items-center gap-4">

                                    {events?.organizer?.avatarUrl ? (
                                        <img
                                            src={events.organizer.avatarUrl}
                                            alt={events.organizer.fullName}
                                            className="size-12 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Star className="w-6 h-6 text-primary fill-primary/20" />
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-bold">{events?.organizer?.fullName || 'Đang cập nhật'}</p>
                                        <p className="text-xs text-primary ">{events?.organizer?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>

        </>
    )
}

export default EventDetailPage

