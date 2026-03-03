import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Info,
    Clock,
    MapPin,
    Upload,
    Plus,
    Trash2,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Facebook,
    Twitter,
    Linkedin,
    Calendar,
    Rocket,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Step indicator at the top
// ─────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Basic Info' },
        { id: 2, label: 'Tickets & Pricing' },
    ];

    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((step, idx) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isCompleted
                                        ? 'bg-[#4a9e9e] border-[#4a9e9e] text-white'
                                        : isActive
                                            ? 'bg-[#2d3a4f] border-[#2d3a4f] text-white'
                                            : 'bg-white border-gray-200 text-gray-400'
                                    }`}
                            >
                                {isCompleted ? <CheckCircle2 size={18} /> : step.id}
                            </div>
                            <span
                                className={`text-xs mt-1.5 font-medium ${isActive || isCompleted ? 'text-gray-700' : 'text-gray-400'
                                    }`}
                            >
                                {isCompleted ? `Step ${step.id}: Details` : isActive && step.id === 2 ? 'Step 2: Tickets & Pricing' : step.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-3 mt-[-10px] transition-all ${currentStep > 1 ? 'bg-[#4a9e9e]' : 'bg-gray-200'
                                    }`}
                                style={{ minWidth: 120, maxWidth: 300 }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ─────────────────────────────────────────────
// Step 1 – Basic Info
// ─────────────────────────────────────────────
const CATEGORIES = [
    'Conference', 'Concert', 'Workshop', 'Networking', 'Festival',
    'Sports', 'Art & Culture', 'Tech', 'Business', 'Other',
];

const Step1BasicInfo = ({ form, onChange }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(form.coverPreview || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange({ coverFile: file, coverPreview: url });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange({ coverFile: file, coverPreview: url });
    };

    return (
        <div className="space-y-6">
            {/* Event Details */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
                        <Info size={13} className="text-[#4a9e9e]" />
                    </div>
                    Event Details
                </h2>

                {/* Event Name */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Event Name</label>
                    <input
                        type="text"
                        placeholder="Enter a catchy title for your event"
                        value={form.eventName}
                        onChange={(e) => onChange({ eventName: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                    />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                    <select
                        value={form.category}
                        onChange={(e) => onChange({ category: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] bg-white transition appearance-none"
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                    <textarea
                        placeholder="Tell your attendees what to expect..."
                        value={form.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] resize-y transition"
                    />
                </div>

                {/* Event Cover Image */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Event Cover Image</label>
                    <div
                        className="border-2 border-dashed border-[#4a9e9e]/40 rounded-xl bg-[#f0fafa] flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-[#e6f5f5] transition"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {preview ? (
                            <img src={preview} alt="Cover preview" className="max-h-44 rounded-lg object-cover" />
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-[#4a9e9e]/20 rounded-full flex items-center justify-center mb-3">
                                    <Upload size={22} className="text-[#4a9e9e]" />
                                </div>
                                <p className="text-sm font-medium text-gray-600">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </section>

            {/* Schedule Details */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
                        <Clock size={13} className="text-[#4a9e9e]" />
                    </div>
                    Schedule Details
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date</label>
                        <input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => onChange({ startDate: e.target.value })}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date</label>
                        <input
                            type="date"
                            value={form.endDate}
                            onChange={(e) => onChange({ endDate: e.target.value })}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time</label>
                        <input
                            type="time"
                            value={form.startTime}
                            onChange={(e) => onChange({ startTime: e.target.value })}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                        />
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
                        <MapPin size={13} className="text-[#4a9e9e]" />
                    </div>
                    Location
                </h2>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Venue Address</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for a location or address"
                            value={form.location}
                            onChange={(e) => onChange({ location: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

// ─────────────────────────────────────────────
// Step 2 – Tickets & Pricing
// ─────────────────────────────────────────────
const Step2Tickets = ({ form, onChange }) => {
    const handleTicketChange = (idx, field, value) => {
        const updated = form.tickets.map((t, i) =>
            i === idx ? { ...t, [field]: value } : t
        );
        onChange({ tickets: updated });
    };

    const addTicket = () => {
        onChange({
            tickets: [...form.tickets, { name: '', quantity: '', price: '' }],
        });
    };

    const removeTicket = (idx) => {
        onChange({ tickets: form.tickets.filter((_, i) => i !== idx) });
    };

    return (
        <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Step 2: Ticket Types &amp; Inventory</h2>
                <p className="text-sm text-gray-400 mb-6">Configure your pricing tiers and set availability for each category.</p>

                {/* Table header */}
                <div className="grid grid-cols-12 gap-3 mb-2 px-1">
                    <div className="col-span-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ticket Name</div>
                    <div className="col-span-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quantity</div>
                    <div className="col-span-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price (USD)</div>
                    <div className="col-span-1" />
                </div>

                <div className="space-y-3">
                    {form.tickets.map((ticket, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-12 gap-3 items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                        >
                            <div className="col-span-5">
                                <input
                                    type="text"
                                    placeholder="e.g. General Admission"
                                    value={ticket.name}
                                    onChange={(e) => handleTicketChange(idx, 'name', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                                />
                            </div>
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={ticket.quantity}
                                    onChange={(e) => handleTicketChange(idx, 'quantity', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                                />
                            </div>
                            <div className="col-span-3">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={ticket.price}
                                        onChange={(e) => handleTicketChange(idx, 'price', e.target.value)}
                                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => removeTicket(idx)}
                                    className="p-1.5 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add ticket */}
                <button
                    type="button"
                    onClick={addTicket}
                    className="mt-4 w-full border-2 border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:border-[#4a9e9e]/50 hover:text-[#4a9e9e] hover:bg-[#f0fafa] transition"
                >
                    <Plus size={16} />
                    Add Another Ticket Type
                </button>
            </section>

            {/* Advanced Settings */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Advanced Settings</p>

                <div className="space-y-4">
                    <ToggleSetting
                        icon={
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Calendar size={14} className="text-gray-500" />
                            </div>
                        }
                        title="Limit tickets per person"
                        description="Enable to restrict how many tickets a single account can buy"
                        checked={form.limitPerPerson}
                        onChange={(v) => onChange({ limitPerPerson: v })}
                    />
                    <ToggleSetting
                        icon={
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                            </div>
                        }
                        title="Private event (invite only)"
                        description="Your event will only be accessible via a direct secret link"
                        checked={form.privateEvent}
                        onChange={(v) => onChange({ privateEvent: v })}
                    />
                </div>
            </section>
        </div>
    );
};

const ToggleSetting = ({ icon, title, description, checked, onChange }) => (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
        {icon}
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[#4a9e9e]' : 'bg-gray-200'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    </div>
);

// ─────────────────────────────────────────────
// Step 3 – Success screen
// ─────────────────────────────────────────────
const SuccessScreen = ({ form, onBack }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-lg w-full flex flex-col items-center text-center">
                {/* Check icon */}
                <div className="w-16 h-16 bg-[#4a9e9e]/15 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle2 size={36} className="text-[#4a9e9e]" strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Submitted Successfully!</h2>
                <p className="text-sm text-gray-400 mb-6">
                    Your event has been submitted for review. You can track its status in your events dashboard.
                </p>

                {/* Event summary card */}
                <div className="w-full bg-[#f9f9f7] rounded-xl border border-gray-100 p-4 flex items-center gap-3 mb-6 text-left">
                    <div className="w-12 h-12 rounded-full bg-[#4a9e9e]/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {form.coverPreview ? (
                            <img src={form.coverPreview} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <Calendar size={20} className="text-[#4a9e9e]" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{form.eventName || 'New Event'}</p>
                        <p className="text-xs text-[#4a9e9e] flex items-center gap-1 mt-0.5">
                            <Calendar size={11} />
                            {form.startDate || '—'}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} />
                            {form.location || '—'}
                        </p>
                    </div>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate('/organizer/my-events')}
                    className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-7 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to My Events
                </button>

                <p className="text-[11px] uppercase tracking-widest text-gray-300 mb-3">Share Your Event</p>
                <div className="flex items-center gap-5">
                    <button className="text-gray-300 hover:text-blue-600 transition"><Facebook size={22} /></button>
                    <button className="text-gray-300 hover:text-sky-500 transition"><Twitter size={22} /></button>
                    <button className="text-gray-300 hover:text-blue-700 transition"><Linkedin size={22} /></button>
                </div>

                <p className="text-[11px] text-gray-300 mt-8">© 2025 EventHub Organizer. Professional Event Management.</p>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const initialForm = {
    eventName: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    location: '',
    coverFile: null,
    coverPreview: null,
    tickets: [
        { name: 'Early Bird', quantity: '200', price: '45.00' },
        { name: 'General Admission', quantity: '1000', price: '75.00' },
        { name: 'VIP Access', quantity: '50', price: '250.00' },
    ],
    limitPerPerson: true,
    privateEvent: false,
};

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1, 2, or 3 (success)
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);

    const updateForm = (partial) => setForm((prev) => ({ ...prev, ...partial }));

    const handleSaveDraft = () => {
        // TODO: integrate with API
        console.log('Save as draft:', form);
    };

    const handleContinue = () => {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setSaving(true);
        // TODO: integrate with API – POST /api/events
        await new Promise((r) => setTimeout(r, 800)); // simulate network
        setSaving(false);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-[#f0f0ec] p-8">
                <SuccessScreen form={form} />
            </div>
        );
    }

    const progressPct = step === 1 ? 40 : 85;

    return (
        <div className="min-h-screen bg-[#f0f0ec]">
            {/* Top bar */}
            <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-8 py-3">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <button
                            onClick={() => navigate('/organizer/my-events')}
                            className="hover:text-gray-700 transition"
                        >
                            My Events
                        </button>
                        <span>›</span>
                        <span className="font-semibold text-gray-700">Create New Event</span>
                    </nav>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={handleSaveDraft}
                            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition"
                        >
                            Save Draft
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Progress</span>
                            <div className="w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#4a9e9e] rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-3xl mx-auto py-10 px-4">
                <StepIndicator currentStep={step} />

                {step === 1 && <Step1BasicInfo form={form} onChange={updateForm} />}
                {step === 2 && <Step2Tickets form={form} onChange={updateForm} />}

                {/* Footer actions */}
                <div className="flex items-center justify-between mt-6">
                    {step === 2 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step === 1 && (
                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                        >
                            Continue to Tickets
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-60"
                        >
                            {saving ? 'Submitting…' : 'Submit Event'}
                            <Rocket size={16} />
                        </button>
                    )}
                </div>

                {/* Footer hint */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    {step === 1
                        ? 'Step 1: Provide basic info about your event to get started.'
                        : 'Last saved: just now'}
                </p>
            </main>
        </div>
    );
};

export default CreateEventPage;
