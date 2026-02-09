import React from 'react';
import { Upload } from 'lucide-react';
import { Input, TextArea, Select } from '../../../components/ui/Input';

export const EventDetailsSection = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm">i</div>
                <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
            </div>

            <div className="space-y-6">
                <Input
                    label="Event Name"
                    placeholder="Enter a catchy title for your event"
                />

                <div className="w-full space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <Select
                        options={[
                            { label: "Select Category", value: "" },
                            { label: "Conference", value: "conference" },
                            { label: "Workshop", value: "workshop" },
                            { label: "Concert", value: "concert" },
                        ]}
                    />
                </div>

                <TextArea
                    label="Description"
                    placeholder="Tell your attendees what to expect..."
                />

                <div className="w-full space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Event Cover Image</label>
                    <div className="border-2 border-dashed border-teal-200 rounded-xl bg-teal-50/30 p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50/50 transition-colors">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600">
                            <Upload className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Click to upload or drag and drop</h3>
                        <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
