import React from 'react';
import { 
  ArrowLeft, Type, AlignLeft, UploadCloud, TrendingUp, 
  CheckSquare, Calendar, FileText, Info
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { Link } from 'react-router-dom';

const RecruitmentFormBuilder = () => {
  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* 1. Sidebar */}
      <Sidebar />

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col ml-64">
        
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/organizer/recruitments" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors">
              <ArrowLeft size={16} /> Back to List
            </Link>
            <div className="w-px h-5 bg-gray-200"></div>
            <p className="text-sm font-medium text-gray-400 italic">Editing: <span className="font-bold text-gray-700 not-italic">Staff Application Form</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              Save Draft
            </button>
            <button className="px-5 py-2.5 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-sm font-bold shadow-md transition-all">
              Publish Recruitment Form
            </button>
          </div>
        </header>

        {/* --- KHU VỰC 3 CỘT LÀM VIỆC --- */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CỘT 1: INPUT ELEMENTS (BÊN TRÁI) */}
          <div className="w-72 bg-white border-r border-gray-100 p-6 overflow-y-auto shrink-0 z-10">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Input Elements</h3>
            
            <div className="space-y-3 mb-8">
              <ToolItem icon={<Type size={18} />} label="Short Answer" />
              <ToolItem icon={<AlignLeft size={18} />} label="Paragraph" />
              <ToolItem icon={<UploadCloud size={18} className="text-[#2dd4bf]" />} label="File Upload (CV)" active />
              <ToolItem icon={<TrendingUp size={18} />} label="Experience Level" />
              <ToolItem icon={<CheckSquare size={18} />} label="Skills Checklist" />
              <ToolItem icon={<Calendar size={18} />} label="Available Shifts" />
            </div>

            {/* Pro Tip Card */}
            <div className="bg-[#f8f7f2] rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Pro Tip</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Drag components directly into the form canvas to start building.
              </p>
            </div>
          </div>

          {/* CỘT 2: FORM CANVAS (Ở GIỮA) */}
          <div className="flex-1 bg-[#ecebe4] p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-xl">
              
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                {/* Form Header Banner */}
                <div className="h-32 bg-[#8c9db3] relative flex justify-center">
                  <div className="absolute -bottom-6 w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-[#8c9db3]">
                    <FileText size={28} />
                  </div>
                </div>

                <div className="p-10 pt-12">
                  {/* Form Title */}
                  <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">Staff Application Form:<br/>BridgeFest 2025</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Welcome! Please fill out the details below to apply for a staff position at the upcoming BridgeFest.
                    </p>
                  </div>

                  {/* Field 1: Paragraph (Active State) */}
                  <div className="relative p-6 rounded-xl border-2 border-[#2dd4bf] mb-6 shadow-sm">
                    {/* Dải màu đánh dấu active */}
                    <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#2dd4bf] rounded-r"></div>
                    
                    <label className="block font-bold text-gray-800 mb-3">
                      Tell us about your previous event experience <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-400 text-sm outline-none resize-none"
                      placeholder="Type your answer here..."
                      readOnly
                    ></textarea>
                  </div>

                  {/* Field 2: File Upload */}
                  <div className="p-6 rounded-xl border-2 border-dashed border-[#2dd4bf] bg-[#2dd4bf]/5 cursor-pointer">
                    <label className="block font-bold text-gray-800 mb-4 text-center">
                      Upload your CV <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-[#2dd4bf] rounded-full flex items-center justify-center text-white mb-3 shadow-md">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-sm font-bold text-[#2dd4bf]">Drag and drop your file here, or browse</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">Supported formats: PDF, DOCX (Max 10MB)</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* CỘT 3: FIELD PROPERTIES (BÊN PHẢI) */}
          <div className="w-80 bg-white border-l border-gray-100 p-6 overflow-y-auto shrink-0 z-10 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-gray-900">Field Properties</h3>
              <span className="text-[#2dd4bf] text-[10px] font-bold uppercase tracking-wider">Paragraph</span>
            </div>

            {/* Field Label */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Field Label</label>
              <textarea 
                className="w-full border border-gray-200 rounded-lg p-3 text-sm font-bold text-gray-700 outline-none focus:border-[#8c9db3] resize-none h-16 shadow-sm"
                defaultValue="Tell us about your previous event experience"
              ></textarea>
            </div>

            {/* Placeholder Text */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Placeholder Text</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-500 outline-none focus:border-[#8c9db3] shadow-sm"
                defaultValue="Type your answer here..."
              />
            </div>

            {/* Required Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="block text-sm font-bold text-gray-700">Required Field</span>
                <span className="text-[10px] text-gray-400 font-medium">User must fill this out</span>
              </div>
              <div className="w-11 h-6 rounded-full bg-[#2dd4bf] relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-6 shadow-sm"></div>
              </div>
            </div>

            {/* Max Characters */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Max Characters</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  className="w-24 border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-gray-700 outline-none focus:border-[#8c9db3] shadow-sm"
                  defaultValue="500"
                />
                <span className="text-xs text-gray-400 font-bold">chars</span>
              </div>
            </div>

            {/* File Settings (Hiển thị mock theo thiết kế) */}
            <div className="mb-8 pt-6 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">File Settings</p>
              <label className="block text-xs font-bold text-gray-600 mb-2">Max File Size</label>
              <select className="w-full border border-gray-200 rounded-lg p-3 text-sm font-bold text-gray-700 outline-none shadow-sm cursor-pointer">
                <option>10 MB</option>
                <option>25 MB</option>
                <option>50 MB</option>
              </select>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto flex flex-col gap-3">
              <button className="w-full py-3.5 bg-[#0f172a] hover:bg-black text-white rounded-xl font-bold text-sm shadow-md transition-all">
                Update Field
              </button>
              <button className="w-full py-2 text-gray-400 hover:text-gray-700 font-bold text-xs transition-colors">
                Reset Defaults
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* Component phụ trợ cho menu bên trái */
const ToolItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
    active 
      ? 'border-[#2dd4bf] bg-[#2dd4bf]/5 shadow-sm' 
      : 'border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-600'
  }`}>
    <div className={`${active ? 'text-[#2dd4bf]' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span className={`text-sm font-bold ${active ? 'text-[#2dd4bf]' : 'text-gray-700'}`}>
      {label}
    </span>
  </div>
);

export default RecruitmentFormBuilder;