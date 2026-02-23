import React from 'react';
import { LuMapPin, LuSearch } from 'react-icons/lu';
import { Input } from '../../common/Input';

export const LocationSection = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center space-x-2 mb-6">
                <LuMapPin className="w-6 h-6 text-gray-400" />
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
