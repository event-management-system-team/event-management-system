import React, { useState, useEffect } from 'react';
import { Plus, Clock, Lock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; 
import axiosInstance from '../../config/axios';

const RecruitmentList = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`recruitments/dashboards/${eventId}`);
        if (response.status === 200 && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error loading recruitment dashboard:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) fetchDashboard();
  }, [eventId]);

  const getStatusUI = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'OPEN':
        return { 
          color: 'bg-teal-400', 
          text: 'Recruiting', 
          buttonText: 'View Detail', 
          isActive: true 
        };
      case 'CLOSED':
        return { 
          color: 'bg-red-400', 
          text: 'Closed', 
          buttonText: 'View Detail', 
          isActive: false 
        };
      default:
        return { 
          color: 'bg-gray-400', 
          text: status || 'Unknown', 
          buttonText: 'View Detail', 
          isActive: false 
        };
    }
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return "No deadline";
    const d = new Date(dateString);
    return d.toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', 
      day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="flex min-h-screen bg-[#ecebe4] items-center justify-center font-bold text-gray-500 animate-pulse">Loading recruitment list...</div>;
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-[#ecebe4] items-center justify-center flex-col gap-4">
        <p className="font-bold text-red-500 text-lg">Failed to load data!</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold">Retry</button>
      </div>
    );
  }

  // Kiểm tra sự kiện đã kết thúc chưa (Dựa trên eventEndDate từ Backend)
  const isEventEnded = dashboardData?.eventEndDate 
    ? new Date() > new Date(dashboardData.eventEndDate) 
    : false;

  const statsList = [
    { title: "ACTIVE ROLES", value: dashboardData?.stats?.activeRoles || 0, color: "border-[#60a5fa]" },
    { title: "TOTAL APPLICANTS", value: dashboardData?.stats?.totalApplications || 0, color: "border-[#34d399]" },
    { title: "PENDING REVIEW", value: dashboardData?.stats?.pendingReviews || 0, color: "border-[#fb923c]" },
    { title: "HIRED STAFF", value: dashboardData?.stats?.hiredStaff || 0, color: "border-gray-300" }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#ecebe4] font-sans w-full">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden"> 
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-1 sm:mb-2">My Recruitments</h1>
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Manage staff postings and review incoming applications.</p>
          </div>
          
          {!isEventEnded ? (
            <Link 
              to={`/organizer/recruitmentcreate/${eventId}`} 
              className="w-full sm:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} /> Create Recruitment
            </Link>
          ) : (
            <div className="w-full sm:w-auto px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center gap-2 text-sm font-bold cursor-not-allowed shadow-sm">
              <Lock size={18} /> Event Ended
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statsList.map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl lg:rounded-2xl p-5 lg:p-6 shadow-sm border-l-4 ${stat.color} transition-transform hover:-translate-y-1`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* JOB LIST */}
        <div className="space-y-4">
          {dashboardData?.recentRecruitments?.length > 0 ? (
            dashboardData.recentRecruitments.map((job, index) => {
              const ui = getStatusUI(job.status);
              const progressPercent = job.total > 0 ? Math.min((job.currentCount / job.total) * 100, 100) : 0;
              
              return (
                <div key={job.recruitmentId || index} className="bg-white rounded-xl lg:rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between border border-gray-100 hover:shadow-md transition-all group">
                  
                  {/* Cột 1: Tên & Tiến độ */}
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <h3 className="font-extrabold text-gray-900 text-base lg:text-lg ">{job.title}</h3>
                      {job.isNew && (
                        <span className="bg-orange-100 text-orange-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {job.newCount} NEW
                        </span>
                      )}
                    </div>
                    
                    <div className="w-full sm:max-w-xs">
                      <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1.5">
                        <span className="uppercase tracking-widest">Hiring Progress</span>
                        <span className="text-gray-600">{job.currentCount} / {job.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8c9db3] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Cột 2: Trạng thái & Deadline */}
                  <div className="w-full md:w-1/4 flex flex-col justify-center gap-1.5 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ui.color} ${ui.isActive ? 'animate-pulse' : ''}`}></span>
                      <span className="text-xs lg:text-sm font-bold text-gray-600">{ui.text}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11px] lg:text-xs font-medium text-gray-400">
                      <Clock size={14} className="shrink-0" />
                      <span className="truncate">Deadline: <span className="text-gray-500 font-semibold">{formatDeadline(job.deadline)}</span></span>
                    </div>
                  </div>

                  {/* Cột 3: Nút bấm (Theo ảnh mẫu) */}
                  <div className="w-full md:w-1/3 flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-gray-50">
                    <Link 
                      to={`/organizer/recruitments/${job.recruitmentId}`} 
                      className={`px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold transition-all shadow-sm whitespace-nowrap ${
                        ui.isActive 
                          ? 'bg-[#111827] text-white hover:bg-gray-800' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={(e) => !ui.isActive && job.status !== 'CLOSED' && e.preventDefault()}
                    >
                      {ui.buttonText}
                    </Link>
                  </div>

                </div>
              );
            })
          ) : (
             <div className="text-center p-16 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold mb-2">No recruitment roles found.</p>
                <p className="text-gray-300 text-sm">Click "Create Recruitment" to post your first job!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentList;