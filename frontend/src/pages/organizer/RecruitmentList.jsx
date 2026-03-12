import React, { useState, useEffect } from 'react';
import { Plus,Clock } from 'lucide-react';
import { Link,useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; 
import axiosInstance from '../../config/axios';

const RecruitmentList = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const {eventId} = useParams();
  useEffect(() => {
    const fetchDashboard = async () => {
      
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`recruitments/dashboards/${eventId}`);
        if (response.status === 200 && response.data) {
          console.log("🚀 Lấy dữ liệu Tuyển dụng thành công:", response.data);
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách tuyển dụng:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) {
        fetchDashboard();
    }
  }, [eventId]);

  

  const getStatusUI = (status) => {
    switch (status?.toUpperCase()) {
      case 'RECRUITING':
        return { color: 'bg-teal-500', text: 'Recruiting', actionText: 'Edit Role', buttonText: 'Review Applications', isActive: true };
      case 'COMPLETED':
        return { color: 'bg-gray-400', text: 'Completed', actionText: 'View Details', buttonText: 'Hired', isActive: false };
      case 'CLOSED':
        return { color: 'bg-red-400', text: 'Closed', actionText: 'View Details', buttonText: 'Closed', isActive: false };
      default:
        return { color: 'bg-blue-400', text: status, actionText: 'View Details', buttonText: 'View', isActive: false };
    }
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return "No deadline";
    const d = new Date(dateString);
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString('vi-VN');
    return `${time} - ${date}`;
  };

  if (isLoading) {
    return <div className="flex min-h-screen bg-[#ecebe4] items-center justify-center font-bold text-gray-500 animate-pulse">Đang tải danh sách tuyển dụng...</div>;
  }

  if (isError || !dashboardData) {
    return <div className="flex min-h-screen bg-[#ecebe4] items-center justify-center font-bold text-red-500">Lỗi không thể tải dữ liệu!</div>;
  }


  const statsList = [
    { title: "ACTIVE ROLES", value: dashboardData?.stats.activeRoles, color: "border-[#60a5fa]" },
    { title: "TOTAL APPLICANTS", value: dashboardData?.stats.totalApplications, color: "border-[#34d399]" },
    { title: "PENDING REVIEW", value: dashboardData?.stats.pendingReviews, color: "border-[#fb923c]" },
    { title: "HIRED STAFF", value: dashboardData?.stats.hiredStaff, color: "border-gray-300" }
  ];

  return (
    <div className="flex min-h-screen bg-[#ecebe4] font-sans">
      <Sidebar />

      <div className="flex-1  p-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Recruitments</h1>
            <p className="text-gray-500 font-medium text-sm">Manage staff postings and review incoming applications.</p>
          </div>
          
          <Link 
            to={`/organizer/recruitmentcreate/${eventId}`} 
            className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all"
          >
            <Plus size={18} strokeWidth={2.5} /> Create Recruitment
          </Link>
        </div>

        {/* THỐNG KÊ (STATS) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {statsList.map((stat, index) => (
            <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${stat.color}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h2 className="text-3xl font-extrabold text-gray-900">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* DANH SÁCH JOB */}
        <div className="space-y-4">
          {dashboardData?.recentRecruitments && dashboardData?.recentRecruitments.length > 0 ? (
            dashboardData?.recentRecruitments.map((job,index) => {
              const ui = getStatusUI(job.status); // Lấy UI tương ứng với trạng thái
              
              return (
                <div key={job.id ||job.recruitmentId || index} className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                  
                  {/* Cột 1: Tên & Tiến độ */}
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
                        <span>{job.currentCount} / {job.total}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8c9db3] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((job.currentCount / job.total) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Cột 2: Trạng thái */}
                  <div className="w-1/4 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${ui.color}`}></span>
                  <span className="text-sm font-bold text-gray-600">{ui.text}</span>
                  </div>
                    
                  {/* Hiển thị Deadline nếu có */}
                  {job.deadline && (
                   <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400">
                      <Clock size={14} className="text-gray-400" />
                      <span>Deadline: <span className="text-gray-500">{formatDeadline(job.deadline)}</span></span>
                    </div>
                  )}
                  </div>

                  {/* Cột 3: Nút bấm */}
                  <div className="w-1/3 flex items-center justify-end gap-6">
                    <Link 
                      to={`/organizer/recruitments/${job.id || job.recruitmentId}`} 
                      className="text-sm font-bold text-gray-500 hover:text-[#8c9db3] transition-colors"
                    >
                      {ui.actionText}
                    </Link>
                    <Link 
                    to={`/organizer/recruitments/${job.id || job.recruitmentId}`} 
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                        ui.isActive 
                          ? 'bg-[#e5e7eb] text-gray-800 hover:bg-gray-300 shadow-sm' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => !ui.isActive && e.preventDefault()} // Chặn click nếu đang đóng
                    >
                      {ui.buttonText}
                    </Link>
                  </div>

                </div>
              );
            })
          ) : (
             <div className="text-center p-10 bg-white rounded-2xl text-gray-500 font-medium">
                Bạn chưa có tin tuyển dụng nào. Hãy nhấn "Create Recruitment" để bắt đầu!
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RecruitmentList;