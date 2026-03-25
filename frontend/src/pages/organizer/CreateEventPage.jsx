import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    AlertCircle,
    ListOrdered,
    User,
    AlignLeft,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import organizerService from '../../services/organizer.service';
import useCategories from '../../hooks/useCategories';

// ─────────────────────────────────────────────
// Step indicator at the top
// ─────────────────────────────────────────────
const StepIndicator = ({ currentStep, t }) => {
    const steps = [
        { id: 1, label: t('ce_basic_info') },
        { id: 2, label: t('ce_tickets_pricing') },
        { id: 3, label: t('ce_agenda') },
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
                                {step.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-3 mt-[-10px] transition-all ${currentStep > step.id ? 'bg-[#4a9e9e]' : 'bg-gray-200'
                                    }`}
                                style={{ minWidth: 100, maxWidth: 240 }}
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


const FieldError = ({ msg }) =>
    msg ? <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{msg}</p> : null;

const Step1BasicInfo = ({ form, onChange, errors = {}, t }) => {
    const { categories, isLoading: catLoading } = useCategories();
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(form.coverPreview || null);

    useEffect(() => {
        if (form.coverPreview) setPreview(form.coverPreview);
    }, [form.coverPreview]);

    // ── Nominatim address autocomplete ──────────────────────────────────────
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const debounceRef = useRef(null);
    const locationWrapperRef = useRef(null);

    const fetchSuggestions = (query) => {
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setLoadingLocation(true);
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1&countrycodes=vn`,
            { headers: { 'Accept-Language': 'vi,en' } }
        )
            .then((res) => res.json())
            .then((data) => {
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            })
            .catch(() => setSuggestions([]))
            .finally(() => setLoadingLocation(false));
    };

    const handleLocationChange = (e) => {
        const val = e.target.value;
        onChange({ location: val });
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 310);
    };

    const handleSelectSuggestion = (item) => {
        onChange({
            location: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),   // Nominatim trả về "lon", đổi sang "lng"
        });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // ────────────────────────────────────────────────────────────────────────

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
                    {t('ce_event_details')}
                </h2>

                {/* Event Name */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_event_name')}</label>
                    <input
                        type="text"
                        placeholder={t('ce_event_name_placeholder')}
                        value={form.eventName}
                        onChange={(e) => onChange({ eventName: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${errors.eventName ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                    />
                    <FieldError msg={errors.eventName} />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_category')}</label>
                    <select
                        value={form.categoryId}
                        onChange={(e) => onChange({ categoryId: e.target.value })}
                        disabled={catLoading}
                        className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white transition appearance-none ${errors.categoryId ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                    >
                        <option value="">{catLoading ? t('ce_loading') : t('ce_select_category')}</option>
                        {categories.map((c) => (
                            <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                        ))}
                    </select>
                    <FieldError msg={errors.categoryId} />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_description')}</label>
                    <textarea
                        placeholder={t('ce_description_placeholder')}
                        value={form.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        rows={5}
                        className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 resize-y transition ${errors.description ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                    />
                    <FieldError msg={errors.description} />
                </div>

                {/* Event Cover Image */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_cover_image')}</label>
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
                                <p className="text-sm font-medium text-gray-600">{t('ce_upload_text')}</p>
                                <p className="text-xs text-gray-400 mt-1">{t('ce_upload_hint')}</p>
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
                    {t('ce_schedule_details')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_start_date')}</label>
                        <DatePicker
                            selected={form.startDate}
                            onChange={(date) => onChange({ startDate: date })}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            minDate={new Date()}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${errors.startDate ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                            wrapperClassName="w-full"
                        />
                        <FieldError msg={errors.startDate} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_end_date')}</label>
                        <DatePicker
                            selected={form.endDate}
                            onChange={(date) => onChange({ endDate: date })}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            minDate={form.startDate}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${errors.endDate ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                            wrapperClassName="w-full"
                        />
                        <FieldError msg={errors.endDate} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_start_time')}</label>
                        <input
                            type="time"
                            value={form.startTime}
                            onChange={(e) => onChange({ startTime: e.target.value })}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${errors.startTime ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                        />
                        <FieldError msg={errors.startTime} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_end_time')}</label>
                        <input
                            type="time"
                            value={form.endTime}
                            onChange={(e) => onChange({ endTime: e.target.value })}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${errors.endTime ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                        />
                        <FieldError msg={errors.endTime} />
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
                        <MapPin size={13} className="text-[#4a9e9e]" />
                    </div>
                    {t('ce_location')}
                </h2>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_venue_address')}</label>
                    <div className="relative" ref={locationWrapperRef}>
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                        <input
                            type="text"
                            placeholder={t('ce_search_location')}
                            value={form.location}
                            onChange={handleLocationChange}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            autoComplete="off"
                            className={`w-full pl-9 pr-9 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${errors.location ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                        />
                        {/* Loading spinner */}
                        {loadingLocation && (
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                <svg className="animate-spin h-4 w-4 text-[#4a9e9e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            </div>
                        )}
                        {/* Suggestions dropdown */}
                        {showSuggestions && (
                            <ul className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                                {suggestions.length === 0 ? (
                                    <li className="px-4 py-3 text-sm text-gray-400 text-center">{t('ce_no_results')}</li>
                                ) : (
                                    suggestions.map((item) => (
                                        <li
                                            key={item.place_id}
                                            onMouseDown={() => handleSelectSuggestion(item)}
                                            className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#f0fafa] transition border-b border-gray-50 last:border-0 group"
                                        >
                                            <MapPin size={14} className="text-[#4a9e9e] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-700 leading-snug truncate">
                                                    {item.name || item.display_name.split(',')[0]}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                                    {item.display_name}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                )}
                                <li className="px-4 py-2 text-[10px] text-gray-300 text-right border-t border-gray-50">
                                    © OpenStreetMap contributors
                                </li>
                            </ul>
                        )}
                    </div>
                    <FieldError msg={errors.location} />
                </div>
            </section>
        </div>
    );
};

// ─────────────────────────────────────────────
// Step 2 – Tickets & Pricing
// ─────────────────────────────────────────────
const Step2Tickets = ({ form, onChange, errors = {}, t }) => {
    const isFree = form.isFree;

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

    const handleToggleFree = (v) => {
        if (v) {
            // Bật Free: set tất cả price về 0
            onChange({
                isFree: true,
                tickets: form.tickets.map((t) => ({ ...t, price: '0' })),
            });
        } else {
            onChange({ isFree: false });
        }
    };

    return (
        <div className="space-y-6">
            <section className={`bg-white rounded-2xl shadow-sm border p-7 transition-all ${isFree ? 'border-[#4a9e9e]/40 bg-[#f0fafa]/40' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold text-gray-800">{t('ce_step2_title')}</h2>
                    {isFree && (
                        <span className="px-3 py-1 bg-[#4a9e9e]/10 text-[#4a9e9e] text-xs font-bold rounded-full border border-[#4a9e9e]/20">
                            {t('ce_free_event_badge')}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-400 mb-6">
                    {isFree
                        ? t('ce_free_event_desc')
                        : t('ce_paid_event_desc')}
                </p>

                {/* Ticket table — locked when isFree */}
                <div className={`transition-all ${isFree ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                    <div className="grid grid-cols-12 gap-3 mb-2 px-1">
                        <div className="col-span-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('ce_ticket_name')}</div>
                        <div className="col-span-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('ce_quantity')}</div>
                        <div className="col-span-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            {isFree ? t('ce_price') : t('ce_price_vnd')}
                        </div>
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
                                        placeholder={t('ce_ticket_placeholder')}
                                        value={ticket.name}
                                        onChange={(e) => handleTicketChange(idx, 'name', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 transition ${errors[`ticket_${idx}_name`] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                                    />
                                    <FieldError msg={errors[`ticket_${idx}_name`]} />
                                </div>
                                <div className="col-span-3">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        value={ticket.quantity}
                                        onChange={(e) => handleTicketChange(idx, 'quantity', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 transition ${errors[`ticket_${idx}_quantity`] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                                    />
                                    <FieldError msg={errors[`ticket_${idx}_quantity`]} />
                                </div>
                                <div className="col-span-3">
                                    {isFree ? (
                                        <div className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-400 font-medium text-center">
                                            {t('ce_free')}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₫</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={
                                                    ticket.price === '' || ticket.price === undefined
                                                        ? ''
                                                        : Number(ticket.price).toLocaleString('vi-VN')
                                                }
                                                onChange={(e) => {
                                                    // Xoá dấu chấm, lấy số thuần
                                                    const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                                                    handleTicketChange(idx, 'price', raw);
                                                }}
                                                className={`w-full pl-7 pr-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 transition ${errors[`ticket_${idx}_price`] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                                            />
                                        </div>
                                    )}
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
                        {t('ce_add_ticket')}
                    </button>
                </div>
            </section>


            {/* Advanced Settings */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('ce_advanced_settings')}</p>

                <div className="space-y-4">
                    {/* Is Free */}
                    <ToggleSetting
                        icon={
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                    <path d="M8 12l2 2 4-4" />
                                </svg>
                            </div>
                        }
                        title={t('ce_free_event_toggle')}
                        description={t('ce_free_event_toggle_desc')}
                        checked={isFree}
                        onChange={handleToggleFree}
                    />

                    {isFree && (
                        <div className="ml-12 mt-1 animate-in fade-in">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                {t('ce_total_capacity')} <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="e.g. 500"
                                value={form.totalCapacity}
                                onChange={(e) => onChange({ totalCapacity: e.target.value })}
                                className={`w-48 px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white transition ${errors.totalCapacity ? 'border-red-400 focus:ring-red-200' : 'border-[#4a9e9e]/40 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'}`}
                            />
                            <FieldError msg={errors.totalCapacity} />
                            <p className="mt-1 text-xs text-gray-400">{t('ce_total_capacity_hint')}</p>
                        </div>
                    )}
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
// Step 3 – Agenda
// ─────────────────────────────────────────────
const emptyAgendaItem = () => ({
    title: '',
    date: null,
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    speaker: '',
});

const Step3Agenda = ({ form, onChange, errors = {}, t }) => {
    // Check if event spans multiple days
    const isMultiDay = form.startDate && form.endDate &&
        dayjs(form.endDate).startOf('day').diff(dayjs(form.startDate).startOf('day'), 'day') >= 1;

    const addItem = () => {
        onChange({ agenda: [...form.agenda, emptyAgendaItem()] });
    };

    const removeItem = (idx) => {
        onChange({ agenda: form.agenda.filter((_, i) => i !== idx) });
    };

    const handleChange = (idx, field, value) => {
        const updated = form.agenda.map((item, i) =>
            i === idx ? { ...item, [field]: value } : item
        );
        onChange({ agenda: updated });
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-bold text-gray-800">
                        {t('ce_step3_title')}
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">{t('ce_session_count', { count: form.agenda.length })}</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                    {t('ce_agenda_desc')}
                </p>

                {/* Agenda items */}
                <div className="space-y-4">
                    {form.agenda.length === 0 && (
                        <div className={`text-center py-10 rounded-xl ${errors._agenda ? 'bg-red-50 border border-red-200 text-red-400' : 'text-gray-300'}`}>
                            <ListOrdered size={36} className={`mx-auto mb-3 ${errors._agenda ? 'opacity-70' : 'opacity-40'}`} />
                            <p className="text-sm font-medium">{errors._agenda || t('ce_no_sessions')}</p>
                            <p className={`text-xs mt-1 ${errors._agenda ? 'text-red-300' : ''}`}>{t('ce_add_session_hint')}</p>
                        </div>
                    )}

                    {form.agenda.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative bg-[#f9f9f7] border border-gray-100 rounded-2xl p-5 group hover:border-[#4a9e9e]/30 transition-all"
                        >
                            {/* Session number badge */}
                            <div className="absolute -top-3 left-4 w-6 h-6 bg-[#4a9e9e] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                {idx + 1}
                            </div>

                            {/* Delete button */}
                            <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-50"
                            >
                                <Trash2 size={15} />
                            </button>

                            {/* Title */}
                            <div className="mb-3 mt-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('ce_session_title')} <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    placeholder={t('ce_session_title_placeholder')}
                                    value={item.title}
                                    onChange={(e) => handleChange(idx, 'title', e.target.value)}
                                    className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${errors[`agenda_${idx}_title`]
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'
                                        }`}
                                />
                                <FieldError msg={errors[`agenda_${idx}_title`]} />
                            </div>

                            {/* Session Date — only show for multi-day events */}
                            {isMultiDay && (
                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        <Calendar size={11} className="inline mr-1 text-[#4a9e9e]" />
                                        {t('ce_session_date')} <span className="text-red-400">*</span>
                                    </label>
                                    <DatePicker
                                        selected={item.date}
                                        onChange={(date) => handleChange(idx, 'date', date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText={t('ce_select_session_date')}
                                        minDate={form.startDate}
                                        maxDate={form.endDate}
                                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${errors[`agenda_${idx}_date`]
                                            ? 'border-red-400 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'
                                            }`}
                                        wrapperClassName="w-full"
                                    />
                                    <FieldError msg={errors[`agenda_${idx}_date`]} />
                                </div>
                            )}

                            {/* Time row */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        <Clock size={11} className="inline mr-1 text-[#4a9e9e]" />
                                        {t('ce_start_time')} <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(e) => handleChange(idx, 'startTime', e.target.value)}
                                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${errors[`agenda_${idx}_startTime`]
                                            ? 'border-red-400 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'
                                            }`}
                                    />
                                    <FieldError msg={errors[`agenda_${idx}_startTime`]} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        <Clock size={11} className="inline mr-1 text-[#4a9e9e]" />
                                        {t('ce_end_time')} <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(e) => handleChange(idx, 'endTime', e.target.value)}
                                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${errors[`agenda_${idx}_endTime`]
                                            ? 'border-red-400 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]'
                                            }`}
                                    />
                                    <FieldError msg={errors[`agenda_${idx}_endTime`]} />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="mb-3">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    <MapPin size={11} className="inline mr-1 text-[#4a9e9e]" />
                                    {t('ce_location_optional')} <span className="text-gray-300 font-normal">{t('ce_optional')}</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('ce_location_placeholder')}
                                    value={item.location}
                                    onChange={(e) => handleChange(idx, 'location', e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition bg-white"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    <AlignLeft size={11} className="inline mr-1 text-[#4a9e9e]" />
                                    {t('ce_description_optional')} <span className="text-gray-300 font-normal">{t('ce_optional')}</span>
                                </label>
                                <textarea
                                    placeholder={t('ce_session_desc_placeholder')}
                                    value={item.description}
                                    onChange={(e) => handleChange(idx, 'description', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] transition resize-none bg-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add session button */}
                <button
                    type="button"
                    onClick={addItem}
                    className="mt-5 w-full border-2 border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:border-[#4a9e9e]/50 hover:text-[#4a9e9e] hover:bg-[#f0fafa] transition"
                >
                    <Plus size={16} />
                    {t('ce_add_session')}
                </button>
            </section>


            {/* Tip */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-500 leading-relaxed">
                    <strong>{t('ce_tip')}</strong> {t('ce_tip_text')}
                </p>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Step 4 – Success screen
// ─────────────────────────────────────────────
const SuccessScreen = ({ form, isEditMode, t }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-lg w-full flex flex-col items-center text-center">
                {/* Check icon */}
                <div className="w-16 h-16 bg-[#4a9e9e]/15 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle2 size={36} className="text-[#4a9e9e]" strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditMode ? t('ce_event_updated') : t('ce_event_submitted')}
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    {isEditMode
                        ? t('ce_updated_desc')
                        : t('ce_submitted_desc')}
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
                        <p className="font-bold text-gray-900 text-sm">{form.eventName || t('ce_new_event')}</p>
                        <p className="text-xs text-[#4a9e9e] flex items-center gap-1 mt-0.5">
                            <Calendar size={11} />
                            {form.startDate ? dayjs(form.startDate).format('DD/MM/YYYY') : '—'}
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
                    {t('ce_back_to_events')}
                </button>

                <p className="text-[11px] uppercase tracking-widest text-gray-300 mb-3">{t('ce_share_event')}</p>
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
    categoryId: '',
    description: '',
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    location: '',
    lat: null,
    lng: null,
    coverFile: null,
    coverPreview: null,
    tickets: [
        { name: 'Early Bird', quantity: '200', price: '45.00' },
        { name: 'General Admission', quantity: '1000', price: '75.00' },
        { name: 'VIP Access', quantity: '50', price: '250.00' },
    ],
    isFree: false,
    totalCapacity: '',
    agenda: [],
};

// ─── Validation helpers ─────────────────────────────────────────────────────
const validateStep1 = (form, t) => {
    const e = {};
    if (!form.eventName.trim()) e.eventName = t('ce_val_name_required');
    if (!form.categoryId) e.categoryId = t('ce_val_category_required');
    if (!form.description.trim()) e.description = t('ce_val_desc_required');
    if (!form.startDate) e.startDate = t('ce_val_start_required');
    else if (dayjs(form.startDate).startOf('day').isBefore(dayjs().startOf('day')))
        e.startDate = t('ce_val_start_future');
    if (!form.endDate) e.endDate = t('ce_val_end_required');
    else if (form.startDate && dayjs(form.endDate).startOf('day').isBefore(dayjs(form.startDate).startOf('day')))
        e.endDate = t('ce_val_end_after_start');
    if (!form.startTime) e.startTime = t('ce_val_start_time');
    if (!form.endTime) e.endTime = t('ce_val_end_time');
    // Same-day event: endTime must be after startTime
    if (form.startDate && form.endDate && form.startTime && form.endTime) {
        const sameDay = dayjs(form.endDate).startOf('day').diff(dayjs(form.startDate).startOf('day'), 'day') === 0;
        if (sameDay && form.endTime <= form.startTime) {
            e.endTime = t('ce_val_end_time_after');
        }
    }
    if (!form.location.trim()) e.location = t('ce_val_location');
    return e;
};

const validateStep2 = (form, t) => {
    const e = {};
    if (form.isFree) {
        if (!form.totalCapacity || parseInt(form.totalCapacity, 10) <= 0) {
            e.totalCapacity = t('ce_val_capacity');
        }
    } else {
        form.tickets.forEach((tk, idx) => {
            if (!tk.name.trim()) e[`ticket_${idx}_name`] = t('ce_val_ticket_name');
            if (!tk.quantity || parseInt(tk.quantity) <= 0) e[`ticket_${idx}_quantity`] = t('ce_val_ticket_qty');
        });
    }
    return e;
};

const validateStep3 = (form, t) => {
    const e = {};
    if (form.agenda.length === 0) {
        e._agenda = t('ce_val_agenda_required');
    }
    const isMultiDay = form.startDate && form.endDate &&
        dayjs(form.endDate).startOf('day').diff(dayjs(form.startDate).startOf('day'), 'day') >= 1;
    const eventStart = form.startTime;
    const eventEnd = form.endTime;

    form.agenda.forEach((item, idx) => {
        if (!item.title.trim()) e[`agenda_${idx}_title`] = t('ce_val_session_title');

        // Date validation for multi-day events
        if (isMultiDay) {
            if (!item.date) {
                e[`agenda_${idx}_date`] = t('ce_val_session_date');
            } else {
                const sessionDate = dayjs(item.date).startOf('day');
                const start = dayjs(form.startDate).startOf('day');
                const end = dayjs(form.endDate).startOf('day');
                if (sessionDate.isBefore(start) || sessionDate.isAfter(end)) {
                    e[`agenda_${idx}_date`] = t('ce_val_session_date_range');
                }
            }
        }

        if (!item.startTime) {
            e[`agenda_${idx}_startTime`] = t('ce_val_session_start');
        } else if (!isMultiDay && eventStart && item.startTime < eventStart) {
            e[`agenda_${idx}_startTime`] = t('ce_val_session_start_after', { time: eventStart });
        }
        if (!item.endTime) {
            e[`agenda_${idx}_endTime`] = t('ce_val_session_end');
        } else if (item.startTime && item.endTime <= item.startTime) {
            e[`agenda_${idx}_endTime`] = t('ce_val_session_end_after');
        } else if (!isMultiDay && eventEnd && item.endTime > eventEnd) {
            e[`agenda_${idx}_endTime`] = t('ce_val_session_end_before', { time: eventEnd });
        }
    });
    return e;
};

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const isEditMode = Boolean(eventId);
    const { t } = useTranslation();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [loadingEvent, setLoadingEvent] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});


    const scrollToFirstError = (errs) => {
        setTimeout(() => {
            const firstErrEl = document.querySelector('.border-red-400, [class*="border-red"]');
            if (firstErrEl) {
                firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrEl.focus?.();
            }
        }, 100);
    };

    const updateForm = (partial) => setForm((prev) => ({ ...prev, ...partial }));

    useEffect(() => {
        if (!isEditMode) return;
        let cancelled = false;
        const fetchEvent = async () => {
            setLoadingEvent(true);
            try {
                const data = await organizerService.getEventById(eventId);
                if (cancelled) return;

                const startDt = data.startDate ? dayjs(data.startDate) : null;
                const endDt = data.endDate ? dayjs(data.endDate) : null;

                setForm({
                    eventName: data.eventName || '',
                    categoryId: data.categoryId || '',
                    description: data.description || '',
                    startDate: startDt ? startDt.toDate() : null,
                    endDate: endDt ? endDt.toDate() : null,
                    startTime: startDt ? startDt.format('HH:mm') : '',
                    endTime: endDt ? endDt.format('HH:mm') : '',
                    location: data.location || '',
                    lat: data.locationCoordinates?.lat ?? null,
                    lng: data.locationCoordinates?.lng ?? null,
                    coverFile: null,
                    coverPreview: data.bannerUrl || null,
                    tickets: data.tickets?.length > 0
                        ? data.tickets.map((t) => ({
                            name: t.ticketName || '',
                            quantity: String(t.quantity ?? ''),
                            price: String(t.price ?? ''),
                        }))
                        : [{ name: '', quantity: '', price: '' }],
                    isFree: data.isFree ?? false,
                    totalCapacity: data.totalCapacity ? String(data.totalCapacity) : '',
                    agenda: data.agendas?.length > 0
                        ? data.agendas.map((a) => ({
                            title: a.title || '',
                            date: a.date ? new Date(a.date) : null,
                            startTime: a.startTime || '',
                            endTime: a.endTime || '',
                            location: a.location || '',
                            description: a.description || '',
                            speaker: '',
                        }))
                        : [],
                });
            } catch (err) {
                if (!cancelled) {
                    setError(err.response?.data?.message || t('ce_load_failed'));
                }
            } finally {
                if (!cancelled) setLoadingEvent(false);
            }
        };
        fetchEvent();
        return () => { cancelled = true; };
    }, [eventId, isEditMode]);

    const buildEventPayload = (isDraft = false) => ({
        eventName: form.eventName,
        categoryId: form.categoryId,
        description: form.description,
        startDate: form.startDate ? dayjs(form.startDate).format('YYYY-MM-DD') : '',
        endDate: form.endDate ? dayjs(form.endDate).format('YYYY-MM-DD') : '',
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        location_coordinates: (form.lat != null && form.lng != null)
            ? { lat: form.lat, lng: form.lng }
            : undefined,
        tickets: form.isFree
            ? []
            : form.tickets.map((t) => ({
                name: t.name,
                quantity: parseInt(t.quantity, 10) || 0,
                price: parseFloat(t.price) || 0,
            })),
        isFree: form.isFree,
        totalCapacity: form.isFree ? (parseInt(form.totalCapacity, 10) || 0) : undefined,
        agenda: form.agenda.map((item) => {
            const isMultiDay = form.startDate && form.endDate &&
                dayjs(form.endDate).startOf('day').diff(dayjs(form.startDate).startOf('day'), 'day') >= 1;
            const sessionDate = isMultiDay && item.date
                ? dayjs(item.date).format('YYYY-MM-DD')
                : dayjs(form.startDate).format('YYYY-MM-DD');
            return {
                title: item.title,
                date: sessionDate,
                startTime: item.startTime,
                endTime: item.endTime,
                description: item.description || '',
                location: item.location || '',
                speaker: item.speaker || '',
            };
        }),
        draft: isDraft,
    });

    const handleSaveDraft = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload = buildEventPayload(true);
            if (isEditMode) {
                await organizerService.updateEvent(eventId, payload, form.coverFile);
            } else {
                await organizerService.createEvent(payload, form.coverFile);
            }
            navigate('/organizer/my-events');
        } catch (err) {
            setError(err.response?.data?.message || t('ce_save_draft_failed'));
        } finally {
            setSaving(false);
        }
    };

    const handleContinue = () => {
        const e = validateStep1(form, t);
        if (Object.keys(e).length > 0) {
            setErrors(e);
            showToast(t('ce_fix_errors', { count: Object.keys(e).length }));
            scrollToFirstError(e);
            return;
        }
        setErrors({});
        setError(null);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setError(null);
        setErrors({});
        setStep(step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Step 2 → Step 3
    const handleContinueToAgenda = () => {
        const e = validateStep2(form, t);
        if (Object.keys(e).length > 0) {
            setErrors(e);
            showToast(t('ce_fix_errors', { count: Object.keys(e).length }));
            scrollToFirstError(e);
            return;
        }
        setErrors({});
        setError(null);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Step 3 → Submit
    const handleSubmitFinal = async () => {
        const e = validateStep3(form, t);
        if (Object.keys(e).length > 0) {
            setErrors(e);

            scrollToFirstError(e);
            return;
        }
        setErrors({});
        setSaving(true);
        setError(null);
        try {
            const payload = buildEventPayload(false);
            if (isEditMode) {
                await organizerService.updateEvent(eventId, payload, form.coverFile);
            } else {
                await organizerService.createEvent(payload, form.coverFile);
            }
            setStep(4);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || t('ce_submit_failed'));
        } finally {
            setSaving(false);
        }
    };

    if (loadingEvent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f0f0ec]">
                <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-[#7FA5A5] rounded-full animate-spin" />
                <p className="ml-3 text-sm text-gray-400">{t('ce_loading_event')}</p>
            </div>
        );
    }

    if (step === 4) {
        return (
            <div className="min-h-screen bg-[#f0f0ec] p-8">
                <SuccessScreen form={form} isEditMode={isEditMode} t={t} />
            </div>
        );
    }

    const progressPct = step === 1 ? 30 : step === 2 ? 65 : 95;

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
                            {t('ce_my_events')}
                        </button>
                        <span>›</span>
                        <span className="font-semibold text-gray-700">{isEditMode ? t('ce_edit_event') : t('ce_create_new_event')}</span>
                    </nav>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={handleSaveDraft}
                            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition"
                        >
                            {t('ce_save_draft')}
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t('ce_progress')}</span>
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
                <StepIndicator currentStep={step} t={t} />

                {step === 1 && <Step1BasicInfo form={form} onChange={(v) => { updateForm(v); setErrors((prev) => { const k = Object.keys(v)[0]; const n = { ...prev }; delete n[k]; return n; }); }} errors={errors} t={t} />}
                {step === 2 && <Step2Tickets form={form} onChange={(v) => { updateForm(v); setErrors((prev) => { const n = { ...prev }; Object.keys(v).forEach((k) => { if (k === 'tickets') { Object.keys(n).forEach((ek) => { if (ek.startsWith('ticket_')) delete n[ek]; }); } else { delete n[k]; } }); return n; }); }} errors={errors} t={t} />}
                {step === 3 && <Step3Agenda form={form} onChange={(v) => { updateForm(v); setErrors((prev) => { const n = { ...prev }; Object.keys(v).forEach((k) => { if (k === 'agenda') { Object.keys(n).forEach((ek) => { if (ek.startsWith('agenda_') || ek === '_agenda') delete n[ek]; }); } }); return n; }); }} errors={errors} t={t} />}

                {error && (
                    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}



                {/* Footer actions */}
                <div className="flex items-center justify-between mt-6">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={16} />
                            {t('ce_back')}
                        </button>
                    ) : (
                        <div />
                    )}

                    {step === 1 && (
                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                        >
                            {t('ce_continue_tickets')}
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            onClick={handleContinueToAgenda}
                            className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                        >
                            {t('ce_continue_agenda')}
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            onClick={handleSubmitFinal}
                            disabled={saving}
                            className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-60"
                        >
                            {saving ? t('ce_submitting') : t('ce_submit_event')}
                            <Rocket size={16} />
                        </button>
                    )}
                </div>

                {/* Footer hint */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    {step === 1
                        ? t('ce_step1_hint')
                        : step === 2
                            ? t('ce_step2_hint')
                            : t('ce_step3_hint')}
                </p>
            </main>
        </div>
    );
};

export default CreateEventPage;
