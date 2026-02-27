import BannerApply from './BannerApply'
import { useState } from 'react'
import AboutTab from './AboutTab'
import AgendaTab from './AgendaTab'
import MoreInfoTab from './MoreInfoTab'

const ContentLeft = ({ eventName, description, imageGallery, locationCoordinates, metadata, agendas, ticketTypes }) => {

    const navItems = [
        { id: "about", label: "About" },
        { id: "agenda", label: "Agenda" },
        { id: "moreInfo", label: "More Info" },
    ]

    const [active, setActive] = useState('about');

    const renderContent = () => {
        switch (active) {
            case 'about':
                return (
                    <AboutTab
                        description={description}
                        imageGallery={imageGallery}
                        locationCoordinates={locationCoordinates}
                        eventName={eventName}
                    />
                );
            case 'agenda':
                return (
                    <AgendaTab
                        agendas={agendas} />
                )

            case 'moreInfo':
                return (
                    <MoreInfoTab />
                );
            default:
                return null;
        }
    };
    return (
        <div>
            <div className="flex-1 space-y-8">

                <div className="sticky top-0 z-40 bg-background-light/80  backdrop-blur-md border-b border-[#E5E1DA]  -mx-6 px-6">
                    <div className="flex gap-8 py-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActive(item.id)}

                                className={`transition-colors ${active === item.id
                                    ? 'text-primary font-bold border-b-2 border-primary pb-4 -mb-4'
                                    : 'font-semibold text-slate-500 hover:text-primary transition-colors border-transparent'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 min-h-75">
                    {renderContent()}
                </div>


                <BannerApply />


            </div>
        </div>
    )
}

export default ContentLeft
