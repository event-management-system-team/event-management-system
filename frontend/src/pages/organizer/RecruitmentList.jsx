import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; // Import Sidebar dùng chung

const RecruitmentList = () => {
  // Mock Data: Thống kê tổng quan
  const stats = [
    { title: "ACTIVE ROLES", value: "8", color: "border-[#60a5fa]" },
    { title: "TOTAL APPLICANTS", value: "142", color: "border-[#34d399]" },
    { title: "PENDING REVIEW", value: "24", color: "border-[#fb923c]" },
    { title: "HIRED STAFF", value: "56", color: "border-gray-300" }
  ];

  // Mock Data: Danh sách tin tuyển dụng
  const recruitments = [
    {
      id: 1,
      title: "BridgeFest 2025 - Security Guard",
      isNew: true,
      newCount: 5,
      current: 12,
      total: 20,
      status: "Recruiting",
      statusColor: "bg-teal-500",
      actionText: "Edit Role",
      buttonText: "Review Applications",
      buttonActive: true
    },
    {
      id: 2,
      title: "TechCon 2024 - Registration Desk",
      isNew: false,
      newCount: 0,
      current: 10,
      total: 10,
      status: "Completed",
      statusColor: "bg-gray-400",
      actionText: "View Details",
      buttonText: "Hired",
      buttonActive: false
    },
    {
      id: 3,
      title: "Summer Gala - VIP Hostess",
      isNew: true,
      newCount: 12,
      current: 2,
      total: 8,
      status: "Recruiting",
      statusColor: "bg-teal-500",
      actionText: "Edit Role",
      buttonText: "Review Applications",
      buttonActive: true
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#ecebe4] font-sans">
      
      {/* 1. DÙNG CHUNG SIDEBAR */}
      <Sidebar />

      {/* --- CỘT NỘI DUNG CHÍNH --- */}
      <div className="flex-1 ml-64 p-10">
        
        {/* Header có thêm nút Create */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Recruitments</h1>
            <p className="text-gray-500 font-medium text-sm">Manage staff postings and review incoming applications.</p>
          </div>
          
          {/* Nút bấm chuyển sang trang Builder */}
          <Link 
            to="/organizer/recruitmentcreate" 
            className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all"
          >
            <Plus size={18} strokeWidth={2.5} /> Create Recruitment
          </Link>
        </div>

        {/* 4 Thẻ Thống Kê (Stats) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${stat.color}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h2 className="text-3xl font-extrabold text-gray-900">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Danh sách Công việc (Job Cards) */}
        <div className="space-y-4">
          {recruitments.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
              
              {/* Phần Tên Job & Thanh Tiến Độ */}
              <div className="w-1/3">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-extrabold text-gray-900 text-lg">{job.title}</h3>
                  {job.isNew && (
                    <span className="bg-orange-100 text-orange-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {job.newCount} NEW
                    </span>
                  )}
                </div>
                
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>Hiring Progress</span>
                    <span>{job.current} / {job.total}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8c9db3] rounded-full transition-all duration-500"
                      style={{ width: `${(job.current / job.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Phần Trạng Thái (Status) */}
              <div className="w-1/4 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${job.statusColor}`}></span>
                <span className="text-sm font-bold text-gray-600">{job.status}</span>
              </div>

              {/* Phần Nút Bấm (Actions) */}
              <div className="w-1/3 flex items-center justify-end gap-6">
                <Link 
                  to="/organizer/recruitmentcreate" 
                  className="text-sm font-bold text-gray-500 hover:text-[#8c9db3] transition-colors"
                >
                  {job.actionText}
                </Link>
                <Link 
                to="/organizer/applications" 
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    job.buttonActive 
                      ? 'bg-[#e5e7eb] text-gray-800 hover:bg-gray-300' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {job.buttonText}
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RecruitmentList;