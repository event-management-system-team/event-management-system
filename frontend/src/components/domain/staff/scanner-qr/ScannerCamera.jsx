import React from 'react';
import { ScanLine, SwitchCamera, QrCode, Flashlight } from 'lucide-react';

const ScannerCamera = () => {
    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col shrink-0 h-[400px] lg:h-1/2">
            <div className="flex items-center justify-between mb-3 px-1 shrink-0">
                <div className="flex items-center gap-2">
                    <ScanLine className="text-[#89A8B2]" size={22} />
                    <h2 className="text-[#2C3E50] text-base font-extrabold tracking-tight">Ticket Scanner</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                    <span className="animate-pulse size-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Camera Active</span>
                </div>
            </div>

            <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-black shrink-0 flex items-center justify-center">
                {/* Nền Camera (Mockup) */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80")' }}>
                </div>

                {/* Khung Scan */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-xl flex flex-col items-center justify-center z-10">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#4ECDC4] rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#4ECDC4] rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#4ECDC4] rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#4ECDC4] rounded-br-lg"></div>

                    {/* Tia Scan chuyển động */}
                    <div className="w-full h-[2px] bg-[#4ECDC4] shadow-[0_0_15px_rgba(78,205,196,1)] absolute scanner-line rounded-full"></div>

                    <p className="text-white font-bold text-xs mt-auto mb-4 drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Căn chỉnh mã QR</p>
                </div>

                {/* Nút điều khiển Camera */}
                <div className="absolute bottom-4 left-0 right-0 px-6 flex items-center justify-center gap-6 z-20">
                    <button className="size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 transition-all">
                        <SwitchCamera size={20} />
                    </button>
                    <button className="size-12 rounded-full bg-[#89A8B2]/90 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-white shadow-[0_0_15px_rgba(137,168,178,0.5)] hover:bg-[#89A8B2] hover:scale-105 transition-all">
                        <QrCode size={24} />
                    </button>
                    <button className="size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 transition-all">
                        <Flashlight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScannerCamera;