import React from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from '../../../components/common/Input';

export const LocationSection = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center space-x-2 mb-6">
                <MapPin className="w-6 h-6 text-gray-400" /> {/* Using MapPin as icon, though screenshot has a custom location pin with 'i' or similar? No, standard pin in screenshot matches MapPin style approximately but filled. */}
                <h2 className="text-xl font-bold text-gray-900">Location</h2>
            </div>

            <div className="space-y-6">
                <Input
                    label="Venue Address"
                    placeholder="Search for a location or address"
                    icon={Search}
                />
            </div>
        </div>
    );
};
