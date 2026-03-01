import React from 'react'
import EmptyState from '../../common/EmptyState'
import { MapPin } from 'lucide-react'

const AboutTab = ({ eventName, description, imageGallery, locationCoordinates, }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-cream p-8 min-h-36 rounded-3xl leading-relaxed ">
                <h3 className="text-2xl font-bold mb-4">Experience the {eventName}</h3>

                {description ? (
                    <div className="prose max-w-none text-slate-600">
                        {description}
                    </div>
                ) : (
                    <EmptyState />
                )}


                {imageGallery && imageGallery.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h4 className="text-xl font-bold mb-4">Event Gallery</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {imageGallery.map((imgUrl, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>



            {locationCoordinates && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Location</h3>

                    <div className="w-full h-80 rounded-3xl overflow-hidden relative border border-slate-200 shadow-inner">
                        <iframe
                            title="Event Location Map"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${locationCoordinates.lat},${locationCoordinates.lng}&z=16&output=embed`}
                        ></iframe>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AboutTab
