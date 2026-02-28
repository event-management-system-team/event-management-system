import React from 'react';
const MOCK_RECRUITMENTS = [
    {
        id: "rec_01",
        event_name: "Summer Symphony 2025",
        location: "Hà Nội",
        deadline: "2025-05-30T23:59:00",
        description: "Tham gia đội ngũ vận hành cho lễ hội âm nhạc cổ điển lớn nhất mùa hè năm nay tại Nhà hát lớn Hà Nội. Chúng tôi đang tìm kiếm những người đam mê nghệ thuật và có tinh thần trách nhiệm cao.",
        badge: "URGENT",
        badgeColor: "bg-red-500",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
        positions: [
            { name: "Security Guard", vacancy: 10 },
            { name: "Event Coordinator", vacancy: 2 },
            { name: "Volunteer", vacancy: 20 }
        ]
    },
    {
        id: "rec_02",
        event_name: "Tech Innovators Forum",
        location: "TP. Hồ Chí Minh",
        deadline: "2025-06-15T23:59:00",
        description: "Hỗ trợ quản lý hậu trường và điều phối diễn giả cho một trong những hội nghị công nghệ lớn nhất năm. Cơ hội tuyệt vời để networking.",
        badge: "HOT",
        badgeColor: "bg-accent-orange",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        positions: [
            { name: "Technical Assistant", vacancy: 5 },
            { name: "Check-in Staff", vacancy: 8 }
        ]
    },
    {
        id: "rec_03",
        event_name: "Da Nang Marathon 2025",
        location: "Đà Nẵng",
        deadline: "2025-07-01T23:59:00",
        description: "Đồng hành cùng hàng ngàn vận động viên trong giải chạy marathon quốc tế dọc bờ biển Đà Nẵng tuyệt đẹp.",
        badge: "NEW",
        badgeColor: "bg-primary",
        image: "https://images.unsplash.com/photo-1552674605-15cff24eb3e1?w=800&q=80",
        positions: [
            { name: "Water Station Staff", vacancy: 50 },
            { name: "Medical Support", vacancy: 10 },
            { name: "Route Guide", vacancy: 30 }
        ]
    }
];

const RecruitmentPage = () => {

    // Hàm format ngày deadline cho đẹp
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="bg-background-light font-display text-[#131516]">

            {/* --- HERO BANNER --- */}
            <section className="relative pt-12 pb-24 px-6 bg-gradient-to-b from-cream to-beige">
                <div className="max-w-[960px] mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Tham gia đội ngũ</h1>
                    <p className="text-gray-600 mb-10 max-w-xl mx-auto">Khám phá cơ hội làm việc và cống hiến tại những sự kiện hấp dẫn nhất.</p>

                    {/* Search Bar */}
                    <div className="search-shadow bg-white p-2 rounded-xl flex flex-col md:flex-row items-center gap-2 max-w-[800px] mx-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-gray-100 h-14">
                            <span className="material-symbols-outlined text-gray-400 mr-3">search</span>
                            <input className="w-full border-none focus:ring-0 bg-transparent text-sm font-medium outline-none" placeholder="Tên sự kiện hoặc vị trí..." type="text" />
                        </div>
                        <div className="flex items-center flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-gray-100 h-14">
                            <span className="material-symbols-outlined text-gray-400 mr-3">location_on</span>
                            <input className="w-full border-none focus:ring-0 bg-transparent text-sm font-medium outline-none" placeholder="Khu vực (VD: Hà Nội)" type="text" />
                        </div>
                        <button className="w-full md:w-auto px-10 h-12 md:h-14 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-all uppercase tracking-wider text-sm">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-sm text-slate-500 font-medium">
                    <a className="hover:text-primary transition-colors" href="/">Trang chủ</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 font-bold">Tuyển dụng</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR FILTERS --- */}
                    <aside className="w-full lg:w-[280px] shrink-0">
                        <div className="sticky top-24 h-[calc(100vh-8rem)] bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-bold">Bộ lọc</h3>
                                <button className="text-slate-400 text-sm font-bold hover:text-primary transition-colors">Xóa lọc</button>
                            </div>

                            {/* Location Filter */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                    <span className="font-bold text-sm">Khu vực sự kiện</span>
                                </div>
                                <div className="space-y-3">
                                    {['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'].map((loc, idx) => (
                                        <label key={loc} className="flex items-center gap-3 group cursor-pointer">
                                            <input className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary accent-primary" type="checkbox" />
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">{loc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Deadline Filter */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary text-lg">calendar_clock</span>
                                    <span className="font-bold text-sm">Hạn nộp đơn</span>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 group cursor-pointer">
                                        <input defaultChecked name="deadline" className="h-5 w-5 border-slate-300 text-primary focus:ring-primary accent-primary" type="radio" />
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">Tất cả</span>
                                    </label>
                                    <label className="flex items-center gap-3 group cursor-pointer">
                                        <input name="deadline" className="h-5 w-5 border-slate-300 text-primary focus:ring-primary accent-primary" type="radio" />
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">Trong tuần này</span>
                                    </label>
                                    <label className="flex items-center gap-3 group cursor-pointer">
                                        <input name="deadline" className="h-5 w-5 border-slate-300 text-primary focus:ring-primary accent-primary" type="radio" />
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">Trong tháng này</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* --- RECRUITMENT LISTINGS GRID --- */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

                            {MOCK_RECRUITMENTS.map((recruitment) => (
                                <div key={recruitment.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-200 flex flex-col cursor-pointer">

                                    {/* Cover Image */}
                                    <div className="relative h-[200px] w-full bg-cover bg-center" style={{ backgroundImage: `url('${recruitment.image}')` }}>
                                        {/* Overlay đen mờ cho dễ đọc text */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className={`${recruitment.badgeColor} text-white text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg`}>
                                                {recruitment.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="mb-4">
                                            {/* TÊN SỰ KIỆN NỔI BẬT */}
                                            <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                {recruitment.event_name}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-500 text-sm font-medium mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                                    <span>{recruitment.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-red-500">
                                                    <span className="material-symbols-outlined text-lg">timer</span>
                                                    <span>Hạn nộp: {formatDate(recruitment.deadline)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DANH SÁCH CÁC VỊ TRÍ ĐANG TUYỂN */}
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vị trí đang tuyển:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {recruitment.positions.map((pos, idx) => (
                                                    <span key={idx} className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold">
                                                        {pos.name} <span className="text-primary/60 ml-1">({pos.vacancy})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">
                                            {recruitment.description}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-100">
                                            <button className="w-full bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
                                                Xem chi tiết & Ứng tuyển
                                                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Pagination */}
                        <nav className="mt-12 flex justify-center gap-2 items-center">
                            {/* Nút phân trang giữ nguyên */}
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-primary hover:text-white transition-all font-bold text-slate-600">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecruitmentPage;