import React, { useState } from 'react';
import {
    Award, BookOpen, Coffee, Gift, Star, ShieldCheck,
    Briefcase, Heart, Plus, Trash2, GripVertical
} from 'lucide-react';

// 1. Danh sách các icon cho phép người dùng chọn
const AVAILABLE_ICONS = [
    { id: 'award', component: Award, label: 'Chứng nhận' },
    { id: 'book', component: BookOpen, label: 'Đào tạo' },
    { id: 'coffee', component: Coffee, label: 'Ăn uống' },
    { id: 'gift', component: Gift, label: 'Quà tặng' },
    { id: 'star', component: Star, label: 'Nổi bật' },
    { id: 'shield', component: ShieldCheck, label: 'Bảo vệ' },
    { id: 'briefcase', component: Briefcase, label: 'Công việc' },
    { id: 'heart', component: Heart, label: 'Sức khỏe' },
];

const BenefitFormBuilder = () => {
    // 2. State lưu mảng JSON y hệt cấu trúc Database của bác
    const [benefits, setBenefits] = useState([
        { id: 1, icon: 'book', title: 'Đào tạo miễn phí', description: 'Được training các kỹ năng quản lý sự kiện chuyên nghiệp.' },
    ]);

    // Thêm quyền lợi mới
    const handleAddBenefit = () => {
        setBenefits([...benefits, { id: Date.now(), icon: 'star', title: '', description: '' }]);
    };

    // Xóa quyền lợi
    const handleRemoveBenefit = (id) => {
        setBenefits(benefits.filter(b => b.id !== id));
    };

    // Cập nhật dữ liệu khi người dùng gõ/chọn
    const handleChange = (id, field, value) => {
        setBenefits(benefits.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-6">
                <h2 className="text-lg font-extrabold text-slate-900">Thiết lập Quyền lợi chung</h2>
                <p className="text-[13px] text-slate-500 mt-1">
                    Các quyền lợi này sẽ hiển thị cho tất cả vị trí trong đợt tuyển dụng.
                </p>
            </div>

            {/* Vòng lặp render từng Form Nhập Liệu */}
            <div className="space-y-4">
                {benefits.map((benefit, index) => (
                    <div key={benefit.id} className="relative flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 group">

                        {/* Nút kéo thả (Trang trí cho giống UI xịn) */}
                        <div className="pt-2 cursor-grab text-slate-300 hover:text-slate-500">
                            <GripVertical size={20} />
                        </div>

                        <div className="flex-1 space-y-4">
                            {/* Dòng 1: Chọn Icon + Nhập Tiêu đề */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Cột chọn Icon */}
                                <div className="shrink-0">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Icon</label>
                                    <div className="flex flex-wrap gap-2 w-[240px]">
                                        {AVAILABLE_ICONS.map((ico) => {
                                            const IconComponent = ico.component;
                                            const isSelected = benefit.icon === ico.id;
                                            return (
                                                <button
                                                    key={ico.id}
                                                    type="button"
                                                    onClick={() => handleChange(benefit.id, 'icon', ico.id)}
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isSelected
                                                        ? 'bg-[#4ECDC4] text-white shadow-md shadow-[#4ECDC4]/20'
                                                        : 'bg-white text-slate-400 border border-slate-200 hover:border-[#4ECDC4] hover:text-[#4ECDC4]'
                                                        }`}
                                                    title={ico.label}
                                                >
                                                    <IconComponent size={18} strokeWidth={isSelected ? 2.5 : 2} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Cột nhập Tiêu đề */}
                                <div className="flex-1">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={benefit.title}
                                        onChange={(e) => handleChange(benefit.id, 'title', e.target.value)}
                                        placeholder="VD: Cấp chứng nhận quốc tế..."
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[14px] text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Dòng 2: Nhập Mô tả */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Description</label>
                                <textarea
                                    value={benefit.description}
                                    onChange={(e) => handleChange(benefit.id, 'description', e.target.value)}
                                    placeholder="Mô tả ngắn gọn về quyền lợi này..."
                                    rows="2"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Nút Xóa (Sẽ ẩn nếu chỉ có 1 quyền lợi) */}
                        {benefits.length > 1 && (
                            <button
                                onClick={() => handleRemoveBenefit(benefit.id)}
                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa quyền lợi"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Nút Thêm Mới */}
            <button
                type="button"
                onClick={handleAddBenefit}
                className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
            >
                <Plus size={18} />
                ADD
            </button>

            {/* In thử cục JSON ra cho anh em Backend/Frontend tự tin */}
            <div className="mt-8 p-4 bg-slate-900 rounded-xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dữ liệu JSON sẽ gửi xuống Backend:</p>
                <pre className="text-[#4ECDC4] text-[12px] font-mono whitespace-pre-wrap">
                    {JSON.stringify(benefits.map(({ id, ...rest }) => rest), null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default BenefitFormBuilder;