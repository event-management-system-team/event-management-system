import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { TicketTypesSection } from './components/TicketTypesSection';
import { AdvancedSettingsSection } from './components/AdvancedSettingsSection';
import { ArrowLeft, PartyPopper, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TicketsPricing = () => {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([
        { id: 1, name: 'Early Bird', quantity: 200, price: 45.00 },
        { id: 2, name: 'General Admission', quantity: 1000, price: 75.00 },
        { id: 3, name: 'VIP Access', quantity: 50, price: 250.00 },
    ]);

    const [settings, setSettings] = useState({
        limitTickets: true,
        privateEvent: false,
    });

    const handleAddTicket = () => {
        const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
        setTickets([...tickets, { id: newId, name: '', quantity: 0, price: 0 }]);
    };

    const handleRemoveTicket = (id) => {
        setTickets(tickets.filter(t => t.id !== id));
    };

    const handleTicketChange = (id, field, value) => {
        setTickets(tickets.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ));
    };

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Calculate progress (step 2 of 2 = ~95%)
    const progress = 95;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-8 py-6">
                {/* Breadcrumb + Save Draft + Progress */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-[#8da6ae] hover:underline cursor-pointer" onClick={() => navigate('/create-event')}>My Events</span>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-700 font-medium">Create New Event</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 font-medium hover:text-gray-900 text-sm">Save Draft</button>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-500 tracking-wider">PROGRESS</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#1A202C] rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-10 px-8">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mb-2">
                            <Check className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Step 1: Details</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#8da6ae] mx-6 mt-[-20px]"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#1A202C] text-white flex items-center justify-center font-bold mb-2">2</div>
                        <span className="text-sm font-medium text-gray-700">Step 2: Tickets & Pricing</span>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Ticket Types & Inventory</h2>
                    <p className="text-gray-500 mb-8">Configure your pricing tiers and set availability for each category.</p>

                    {/* Ticket Types */}
                    <TicketTypesSection
                        tickets={tickets}
                        onTicketChange={handleTicketChange}
                        onRemoveTicket={handleRemoveTicket}
                        onAddTicket={handleAddTicket}
                    />

                    {/* Advanced Settings */}
                    <AdvancedSettingsSection
                        settings={settings}
                        onToggle={handleToggle}
                    />
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-2 pb-8">
                    <button
                        onClick={() => navigate('/create-event')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <Button className="bg-[#1A202C] hover:bg-[#2D3748] text-white px-8 py-3 rounded-xl flex items-center space-x-2">
                        <span>Submit Event</span>
                        <PartyPopper className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {/* Last Saved */}
                <div className="text-center pb-6">
                    <span className="text-xs font-bold text-gray-400 tracking-widest">LAST SAVED: JUST NOW</span>
                </div>
            </div>
        </Layout>
    );
};

export default TicketsPricing;
