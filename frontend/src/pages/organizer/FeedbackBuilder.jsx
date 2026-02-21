import React from 'react';
import { 
  ArrowLeft, Star, Hash, List as ListIcon, Smile, MessageSquare, 
  Image as ImageIcon, Minus, Trash2, Heart, ThumbsUp, PlusCircle
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { Link } from 'react-router-dom';

const FeedbackBuilder = () => {
  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* Vùng nội dung chính (bỏ qua 64px của sidebar) */}
      <div className="flex-1 flex flex-col ml-64">
        
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <Link to="/organizer/feedback/list" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="font-extrabold text-lg text-gray-900 tracking-tight">Feedback Form Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              Save Draft
            </button>
            <button className="px-5 py-2 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-sm font-bold shadow-md transition-all">
              Publish Survey
            </button>
          </div>
        </header>

        {/* --- KHU VỰC 3 CỘT LÀM VIỆC --- */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CỘT 1: TOOLBOX (BÊN TRÁI) */}
          <div className="w-72 bg-white border-r border-gray-100 p-6 overflow-y-auto shrink-0 shadow-[4px_0_15px_rgba(0,0,0,0.02)] z-10">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Questions</h3>
            <div className="space-y-3 mb-8">
              <ToolItem icon={<Star size={18} className="text-gray-400"/>} title="Star Rating" desc="Scale of 1 to 5" active />
              <ToolItem icon={<Hash size={18} className="text-gray-400"/>} title="NPS Scale" desc="Likelihood to recommend" />
              <ToolItem icon={<ListIcon size={18} className="text-gray-400"/>} title="Multiple Choice" desc="Select one or many" />
              <ToolItem icon={<Smile size={18} className="text-gray-400"/>} title="Emoji Feedback" desc="Visual sentiment" />
              <ToolItem icon={<MessageSquare size={18} className="text-gray-400"/>} title="Open Comment" desc="Long text response" />
            </div>

            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Layout</h3>
            <div className="space-y-3">
              <ToolItem icon={<ImageIcon size={18} className="text-gray-400"/>} title="Image Header" />
              <ToolItem icon={<Minus size={18} className="text-gray-400"/>} title="Divider" />
            </div>
          </div>

          {/* CỘT 2: CANVAS/FORM PREVIEW (Ở GIỮA) */}
          <div className="flex-1 bg-[#f4f3ed] p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-2xl">
              
              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
                {/* Cover Image */}
                <div className="h-48 bg-gray-800 relative flex items-center justify-center">
                  {/* Ảnh giả lập */}
                  <img src="https://images.unsplash.com/photo-1540039155733-d7696c4826c5?q=80&w=1000&auto=format&fit=crop" alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <h2 className="relative text-white text-3xl font-extrabold tracking-tight drop-shadow-lg z-10">BridgeFest 2025</h2>
                </div>

                <div className="p-10">
                  {/* Form Title & Desc */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Feedback Form: BridgeFest 2025</h2>
                    <p className="text-gray-500 font-medium">Help us make next year even better by sharing your thoughts on the performances, logistics, and overall vibe.</p>
                  </div>

                  {/* Question 1: Star Rating (Đang được chọn/Active) */}
                  <div className="relative p-6 rounded-xl border-2 border-[#8c9db3] bg-[#f8fbff] mb-6 group cursor-pointer shadow-sm">
                    {/* Dải màu xanh bên trái báo hiệu active */}
                    <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#8c9db3] rounded-r"></div>
                    
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                      Rate your overall experience <span className="text-red-500 ml-1">*</span>
                    </h3>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <Star key={i} size={32} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                      ))}
                      {[4, 5].map((i) => (
                        <Star key={i} size={32} className="text-gray-200" />
                      ))}
                    </div>
                  </div>

                  {/* Question 2: Open Text */}
                  <div className="p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors mb-4 cursor-pointer">
                    <h3 className="font-bold text-gray-800 mb-4">What was your favorite performance?</h3>
                    <div className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-400 text-sm">
                      Type your answer here...
                    </div>
                  </div>
                </div>
              </div>

              {/* Drop Zone */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-[#8c9db3] hover:text-[#8c9db3] transition-all cursor-pointer bg-gray-50/50">
                <PlusCircle size={24} className="mb-2" />
                <span className="font-bold text-sm">Drop a question here</span>
              </div>

            </div>
          </div>

          {/* CỘT 3: FIELD PROPERTIES (BÊN PHẢI) */}
          <div className="w-80 bg-white border-l border-gray-100 p-6 overflow-y-auto shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.02)] z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-900">Field Properties</h3>
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Star Rating</span>
            </div>

            {/* Label Input */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question Label</label>
              <textarea 
                className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] focus:ring-1 focus:ring-[#8c9db3] resize-none h-20"
                defaultValue="Rate your overall experience"
              ></textarea>
            </div>

            {/* Toggles */}
            <div className="space-y-4 mb-8 border-y border-gray-100 py-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Required field</span>
                <Toggle active={true} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Show icons</span>
                <Toggle active={true} />
              </div>
            </div>

            {/* Rating Style */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rating Style</label>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#8c9db3] flex items-center justify-center text-[#8c9db3] bg-[#f8fbff] cursor-pointer shadow-sm">
                  <Star size={20} className="fill-[#8c9db3]" />
                </div>
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 cursor-pointer">
                  <Heart size={20} />
                </div>
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 cursor-pointer">
                  <ThumbsUp size={20} />
                </div>
              </div>
            </div>

            {/* Max Rating Dropdown */}
            <div className="mb-8 flex-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Max Rating Value</label>
              <select className="w-full border border-gray-200 rounded-lg p-3 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                <option>5</option>
                <option>10</option>
              </select>
            </div>

            {/* Remove Button */}
            <button className="w-full py-3 rounded-lg border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors mt-auto">
              <Trash2 size={16} /> Remove Question
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- CÁC COMPONENT PHỤ TRỢ --- */

// Nút kéo thả bên trái
const ToolItem = ({ icon, title, desc, active }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
    active ? 'border-[#8c9db3] bg-[#f8fbff] shadow-sm' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
  }`}>
    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-gray-800 leading-tight">{title}</h4>
      {desc && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{desc}</p>}
    </div>
  </div>
);

// Nút gạt On/Off (Toggle)
const Toggle = ({ active }) => (
  <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-[#8c9db3]' : 'bg-gray-200'}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${active ? 'left-6' : 'left-1'}`}></div>
  </div>
);

export default FeedbackBuilder;