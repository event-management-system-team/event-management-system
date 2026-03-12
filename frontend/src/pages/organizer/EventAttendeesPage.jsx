import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import organizerService from '../../services/organizer.service';

const PAGE_SIZE = 10;

const statusConfig = {
    'checked-in': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Checked In' },
    'registered': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Registered' },
    'cancelled': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', label: 'Cancelled' },
};

const normalizeStatus = (raw = '') => {
    const s = raw.toLowerCase().replace(/_/g, '-');
    if (s === 'checkedin' || s === 'checked-in') return 'checked-in';
    if (s === 'cancelled') return 'cancelled';
    return 'registered';
};

const StatusBadge = ({ raw }) => {
    const key = normalizeStatus(raw);
    const cfg = statusConfig[key] || statusConfig.registered;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const Avatar = ({ name, url }) => (
    <img
        src={url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&size=40`}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
    />
);

const EventAttendeesPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    /* ── Fetch event name ── */
    useEffect(() => {
        organizerService.getEventDetail(eventId)
            .then(data => setEvent(data))
            .catch(() => setEvent(null));
    }, [eventId]);

    /* ── Fetch attendees ── */
    const fetchAttendees = useCallback(async (page = 0) => {
        setLoading(true);
        try {
            const data = await organizerService.getEventAttendees(eventId, page, PAGE_SIZE);
            setAttendees(data.content || []);
            setTotalElements(data.totalElements ?? (data.content?.length ?? 0));
            setTotalPages(data.totalPages ?? 1);
        } catch {
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchAttendees(currentPage);
    }, [fetchAttendees, currentPage]);

    /* ── Export Excel (client-side via ExcelJS) ── */
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            // Fetch toàn bộ attendees
            const data = await organizerService.getEventAttendees(eventId, 0, 10000);
            const allAttendees = data.content || [];

            const wb = new ExcelJS.Workbook();
            wb.creator = 'EventHub';
            wb.created = new Date();

            const ws = wb.addWorksheet('Attendees', {
                pageSetup: { paperSize: 9, orientation: 'landscape' },
            });

            // ── Màu sắc theme ──
            const PRIMARY   = '2D3A4F'; // dark navy
            const PRIMARY_L = 'E8EDF3'; // light navy tint
            const SUCCESS   = '16A34A'; // green for checked-in
            const INFO      = '1D4ED8'; // blue for registered
            const DANGER    = 'DC2626'; // red for cancelled

            // ── Row 1: Title ──
            ws.mergeCells('A1:E1');
            const titleCell = ws.getCell('A1');
            titleCell.value = `Attendee List — ${event?.eventName || 'Event'}`;
            titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: PRIMARY } };
            titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
            ws.getRow(1).height = 32;

            // ── Row 2: Sub-info ──
            ws.mergeCells('A2:E2');
            const subCell = ws.getCell('A2');
            subCell.value = `Exported: ${new Date().toLocaleString('vi-VN')}   |   Total: ${allAttendees.length} attendees`;
            subCell.font = { name: 'Calibri', size: 10, color: { argb: '6B7280' }, italic: true };
            subCell.alignment = { vertical: 'middle', horizontal: 'left' };
            ws.getRow(2).height = 20;

            // ── Row 3: blank spacer ──
            ws.getRow(3).height = 8;

            // ── Row 4: Header ──
            const HEADER_DEF = [
                { key: 'no',     header: 'No.',         width: 7  },
                { key: 'name',   header: 'Full Name',   width: 28 },
                { key: 'email',  header: 'Email',       width: 34 },
                { key: 'ticket', header: 'Ticket Type', width: 18 },
                { key: 'status', header: 'Status',      width: 16 },
            ];

            ws.columns = HEADER_DEF.map(c => ({ key: c.key, width: c.width }));

            const headerRow = ws.getRow(4);
            HEADER_DEF.forEach((col, i) => {
                const cell = headerRow.getCell(i + 1);
                cell.value = col.header;
                cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top:    { style: 'thin', color: { argb: '475569' } },
                    bottom: { style: 'thin', color: { argb: '475569' } },
                    left:   { style: 'thin', color: { argb: '475569' } },
                    right:  { style: 'thin', color: { argb: '475569' } },
                };
            });
            headerRow.height = 26;
            headerRow.commit();

            // ── Rows 5+: Data ──
            allAttendees.forEach((a, idx) => {
                const s = normalizeStatus(a.status);
                const statusLabel = statusConfig[s]?.label || s;
                const statusColor = s === 'checked-in' ? SUCCESS : s === 'cancelled' ? DANGER : INFO;
                const rowBg = idx % 2 === 0 ? 'FFFFFF' : PRIMARY_L;

                const row = ws.addRow({
                    no:     idx + 1,
                    name:   a.fullName  || '',
                    email:  a.email     || '',
                    ticket: a.ticketType || 'General',
                    status: statusLabel,
                });

                row.height = 22;
                row.eachCell({ includeEmpty: true }, (cell, colNum) => {
                    cell.font = {
                        name: 'Calibri',
                        size: 10,
                        color: colNum === 5 ? { argb: statusColor } : { argb: '111827' },
                        bold: colNum === 5,
                    };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: colNum === 1 ? 'center' : colNum === 5 ? 'center' : 'left',
                    };
                    cell.border = {
                        top:    { style: 'hair', color: { argb: 'E5E7EB' } },
                        bottom: { style: 'hair', color: { argb: 'E5E7EB' } },
                        left:   { style: 'hair', color: { argb: 'E5E7EB' } },
                        right:  { style: 'hair', color: { argb: 'E5E7EB' } },
                    };
                });
                row.commit();
            });

            // ── Download ──
            const buffer = await wb.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const fileName = `attendees-${(event?.eventName || eventId).replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
            saveAs(blob, fileName);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    /* ── Derived values ── */
    const filtered = search.trim()
        ? attendees.filter(a =>
            (a.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.email || '').toLowerCase().includes(search.toLowerCase()))
        : attendees;

    const checkedInCount = attendees.filter(a => normalizeStatus(a.status) === 'checked-in').length;

    /* ── Pagination ── */
    const goTo = (p) => { setCurrentPage(p); };
    const canPrev = currentPage > 0;
    const canNext = currentPage < totalPages - 1;

    return (
        <div className="p-8 min-h-screen bg-[#f5f5f0]">
            {/* ── Header ── */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Attendee Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? '...' : `${totalElements} Attendees for ${event?.eventName || '…'}`}
                    </p>
                </div>

                {/* Export button */}
                <button
                    onClick={handleExport}
                    disabled={exporting || loading || totalElements === 0}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                    <Download size={16} className={exporting ? 'animate-bounce' : ''} />
                    {exporting ? 'Exporting…' : 'Export List'}
                </button>
            </div>

            {/* ── Card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                {/* Search */}
                <div className="mb-5 relative max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3a4f]/20 focus:border-[#2d3a4f] transition-colors"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Attendee</th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Email</th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Ticket Type</th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center">
                                        <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-[#2d3a4f] rounded-full animate-spin" />
                                        <p className="text-sm text-gray-400 mt-3">Loading attendees…</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center">
                                        <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">No attendees found</p>
                                        {search && <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((attendee, idx) => (
                                    <tr
                                        key={attendee.id || idx}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                                    >
                                        {/* Attendee */}
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={attendee.fullName} url={attendee.avatarUrl} />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{attendee.fullName || '—'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email (standalone col) */}
                                        <td className="py-4 pr-6 text-gray-500">{attendee.email || '—'}</td>

                                        {/* Ticket Type */}
                                        <td className="py-4 pr-6">
                                            {attendee.ticketType ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {attendee.ticketType}
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                    General
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 pr-6">
                                            <StatusBadge raw={attendee.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!loading && totalElements > 0 && (
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {currentPage * PAGE_SIZE + 1} to {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)} of {totalElements} attendees
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => canPrev && goTo(currentPage - 1)}
                                disabled={!canPrev}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} className="text-gray-600" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i).map(p => (
                                <button
                                    key={p}
                                    onClick={() => goTo(p)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === currentPage
                                        ? 'bg-[#2d3a4f] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {p + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => canNext && goTo(currentPage + 1)}
                                disabled={!canNext}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventAttendeesPage;
