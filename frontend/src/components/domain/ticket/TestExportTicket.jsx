import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useExportTicket } from '../../../hooks/useExportTicket'

const TestTicketExport = () => {

    const { ticketRef, isExporting, exportToImage } = useExportTicket();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">

            <div
                ref={ticketRef}
                className="w-full max-w-3xl bg-[#ffe6e6] rounded-[2rem] overflow-hidden flex flex-col sm:flex-row shadow-[0_15px_40px_rgba(220,38,38,0.25)] border border-red-100 relative"
            >
                {/* 1. Phần thông tin sự kiện (Bên trái) */}
                <div className="flex-1 p-8 sm:p-10 bg-gradient-to-br from-[#800020] via-[#c21807] to-[#ff4d4d] text-white relative overflow-hidden">

                    {/* Hiệu ứng ánh sáng vàng trang trí góc */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 rounded-full mix-blend-screen filter blur-[3rem] opacity-30 translate-x-10 -translate-y-10"></div>

                    <div className="relative z-10">
                        {/* Header Vé */}
                        <div className="flex justify-between items-start mb-8">
                            <span className="px-4 py-1.5 bg-yellow-400 text-[#800020] text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
                                VIP PASS
                            </span>
                            <span className="text-red-200 text-sm font-bold tracking-widest opacity-80">
                                TICKET-#12345
                            </span>
                        </div>

                        {/* Tên sự kiện */}
                        <h2 className="text-4xl md:text-5xl font-black mb-3 text-yellow-400 drop-shadow-md leading-tight">
                            BridgeFest 2026
                        </h2>
                        <p className="text-red-100 mb-10 font-medium text-lg tracking-wide">
                            Lễ Hội Âm Nhạc Quốc Tế
                        </p>

                        {/* Lưới thông tin */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-red-300 text-[10px] md:text-xs uppercase font-bold mb-1 tracking-wider">Attendee</p>
                                <p className="font-bold text-lg md:text-xl truncate">Alex Johnson</p>
                            </div>
                            <div>
                                <p className="text-red-300 text-[10px] md:text-xs uppercase font-bold mb-1 tracking-wider">Location</p>
                                <p className="font-bold text-lg md:text-xl truncate">Hanoi, VN</p>
                            </div>
                            <div>
                                <p className="text-red-300 text-[10px] md:text-xs uppercase font-bold mb-1 tracking-wider">Date</p>
                                <p className="font-bold text-lg md:text-xl">Oct 24, 2026</p>
                            </div>
                            <div>
                                <p className="text-red-300 text-[10px] md:text-xs uppercase font-bold mb-1 tracking-wider">Time</p>
                                <p className="font-bold text-lg md:text-xl">18:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Đường cắt rãnh giữa vé (Hiệu ứng đục lỗ) */}
                <div className="hidden sm:flex flex-col justify-between items-center bg-[#ffe6e6] relative w-10 border-l-2 border-dashed border-red-300/50">
                    <div className="w-10 h-5 bg-gray-50 rounded-b-full absolute top-0 shadow-inner"></div>
                    <div className="w-10 h-5 bg-gray-50 rounded-t-full absolute bottom-0 shadow-inner"></div>
                </div>

                {/* 3. Phần QR Code (Bên phải) */}
                <div className="p-8 sm:p-10 bg-[#ffe6e6] flex flex-col items-center justify-center min-w-[240px]">
                    <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-red-100 mb-6 group transition-transform duration-300">
                        {/* QR Code màu Đỏ Burgundy ton-sur-ton */}
                        <QRCodeCanvas
                            value="TICKET-12345-ALEX-JOHNSON"
                            size={140}
                            bgColor={"#ffffff"}
                            fgColor={"#800020"}
                            level={"H"}
                        />
                    </div>
                    <p className="text-[#800020] font-black text-sm tracking-[0.3em] text-center uppercase">
                        Scan at Gate
                    </p>
                </div>
            </div>

            <div className=" mt-10">

                <button
                    onClick={() => exportToImage('BridgeFest_VIP_Ticket.png')}
                    disabled={isExporting}
                    className={`px-10 py-4 rounded-xl font-black text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${isExporting
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-none'
                        : 'bg-yellow-400 text-[#800020] shadow-[0_8px_20px_rgba(250,204,21,0.4)] hover:bg-yellow-300 hover:shadow-[0_12px_25px_rgba(250,204,21,0.6)] hover:-translate-y-1 active:translate-y-0 active:shadow-md'
                        }`}
                >
                    {isExporting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý vé...
                        </>
                    ) : (
                        '⬇ Xuất vé PNG'
                    )}
                </button>
            </div>

        </div>
    );
};

export default TestTicketExport;