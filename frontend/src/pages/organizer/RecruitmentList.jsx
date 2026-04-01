import React, { useState, useEffect } from 'react';
import { Plus, Clock, Lock, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';

import { ArrowLeft } from 'lucide-react';

const RecruitmentList = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`recruitments/dashboards/${eventId}`);
        if (response.status === 200 && response.data) {
          console.log("Dashboard data:", response.data);
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
      case 'DRAFT':
        return { 
          color: 'bg-yellow-400', 
          text: 'Draft', 
          buttonText: 'View Detail', 
          isActive: false 
        };
      case 'CLOSED':
        return { 
          color: 'bg-red-400', 
          text: 'Closed', 
          buttonText: 'View Detail', 
          isActive: true 
        };
      default:
        return { 
          color: 'bg-gray-400', 
          text: status || 'Unknown', 
          buttonText: 'View Detail', 
          isActive: true 
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
    return <div className="flex min-h-screen bg-[#F1F0E8] items-center justify-center font-bold text-gray-500 animate-pulse">Loading recruitment list...</div>;
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-[#F1F0E8] items-center justify-center flex-col gap-4">
        <p className="font-bold text-red-500 text-lg">Failed to load data!</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold">Retry</button>
      </div>
    );
  }

  // Kiểm tra sự kiện đã kết thúc chưa
  const isEventEnded = dashboardData?.eventEndDate 
    ? new Date() > new Date(dashboardData.eventEndDate) 
    : false;

  const statsList = [
    { title: "ACTIVE ROLES", value: dashboardData?.stats?.activeRoles || 0, color: "border-[#60a5fa]" },
    { title: "TOTAL APPLICANTS", value: dashboardData?.stats?.totalApplications || 0, color: "border-[#34d399]" },
    { title: "PENDING REVIEW", value: dashboardData?.stats?.pendingReviews || 0, color: "border-[#fb923c]" },
    { title: "HIRED STAFF", value: dashboardData?.stats?.hiredStaff || 0, color: "border-gray-300" }
  ];
  const hasRecruitments = (dashboardData?.recentRecruitments?.length || 0) > 0;

  // --- Tính toán tổng hợp cho grouped view ---
  const allJobs = dashboardData?.recentRecruitments || [];
  const now = new Date();

  // Xác định status thật cho từng position
  const processedJobs = allJobs.map(job => {
    let currentStatus = job.status?.toUpperCase() || 'OPEN';
    const isPastDeadline = job.deadline ? now > new Date(job.deadline) : false;
    if (currentStatus === 'OPEN' && (isEventEnded || isPastDeadline)) {
      currentStatus = 'CLOSED';
    }
    return { ...job, currentStatus };
  });

  // Tổng hợp
  const totalHired = processedJobs.reduce((sum, j) => sum + j.currentCount, 0);
  const totalVacancy = processedJobs.reduce((sum, j) => sum + j.total, 0);
  const totalNewApps = processedJobs.reduce((sum, j) => sum + j.newCount, 0);
  const progressPercent = totalVacancy > 0 ? Math.min((totalHired / totalVacancy) * 100, 100) : 0;

  // Grouped status: nếu có bất kỳ position DRAFT thì coi như DRAFT, nếu tất cả CLOSED thì CLOSED, còn lại OPEN
  const hasDraft = processedJobs.some(j => j.currentStatus === 'DRAFT');
  const allClosed = processedJobs.length > 0 && processedJobs.every(j => j.currentStatus === 'CLOSED');
  const groupedStatus = hasDraft ? 'DRAFT' : allClosed ? 'CLOSED' : 'OPEN';
  const groupedUI = getStatusUI(groupedStatus);
  const isDraft = groupedStatus === 'DRAFT';

  // Deadline: lấy deadline gần nhất
  const deadlines = processedJobs.map(j => j.deadline).filter(Boolean);
  const earliestDeadline = deadlines.length > 0 
    ? deadlines.sort((a, b) => new Date(a) - new Date(b))[0] 
    : null;

  // Tên event (bỏ phần " - Position" ở title)
  const eventName = processedJobs.length > 0 
    ? (processedJobs[0].title?.split(' - ')?.[0] || 'Recruitment Post')
    : 'Recruitment Post';

  return (
    <div className="flex flex-col min-h-screen w-full">

      <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden"> 
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-6 lg:mb-8">
          <div>
            <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-gray-400 hover:text-gray-700 text-sm font-medium mb-3 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">My Recruitments</h1>
            </button>
            <p className="text-gray-500 text-sm mt-1">Manage staff postings and review incoming applications.</p>
          </div>
          
          {isEventEnded ? (
            <div className="w-full sm:w-auto px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center gap-2 text-sm font-bold cursor-not-allowed shadow-sm">
              <Lock size={18} /> Event Ended
            </div>
          ) : !hasRecruitments ? (
            <Link 
              to={`/organizer/recruitment-post/${eventId}`} 
              className="w-full sm:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} /> Create Recruitment
            </Link>
          ) : null}
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

        {/* GROUPED RECRUITMENT POST */}
        <div className="space-y-4">
          {hasRecruitments ? (
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Header: tổng hợp 1 recruitment post */}
              <div className="p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between">
                
                {/* Cột 1: Tên event & progress */}
                <div className="w-full md:w-1/3">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-extrabold text-gray-900 text-base lg:text-lg">{eventName}</h3>
                    {!isDraft && totalNewApps > 0 && (
                      <span className="bg-orange-100 text-orange-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {totalNewApps} NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <Briefcase size={13} className="text-[#8c9db3] shrink-0" />
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {processedJobs.length === 1
                        ? (processedJobs[0].title?.split(' - ')?.slice(1)?.join(' - ') || processedJobs[0].title)
                        : `${processedJobs.length} positions`
                      }
                    </p>
                  </div>
                  
                  {!isDraft && (
                    <div className="w-full sm:max-w-xs">
                      <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1.5">
                        <span className="uppercase tracking-widest">Hiring Progress</span>
                        <span className="text-gray-600">{totalHired} / {totalVacancy}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8c9db3] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cột 2: Status & Deadline */}
                <div className="w-full md:w-1/4 flex flex-col justify-center gap-1.5 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${groupedUI.color} ${groupedUI.isActive ? 'animate-pulse' : ''}`}></span>
                    <span className="text-xs lg:text-sm font-bold text-gray-600">{groupedUI.text}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[11px] lg:text-xs font-medium text-gray-400">
                    <Clock size={14} className="shrink-0" />
                    <span className="truncate">Deadline: <span className="text-gray-500 font-semibold">{formatDeadline(earliestDeadline)}</span></span>
                  </div>
                </div>

                {/* Cột 3: Buttons */}
                <div className="w-full md:w-1/3 flex items-center justify-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-gray-50">
                  {isDraft && (
                    <Link
                      to={`/organizer/recruitment-post/${eventId}`}
                      state={{ recruitmentId: processedJobs[0]?.recruitmentId }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs lg:text-sm font-bold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all shadow-sm whitespace-nowrap"
                    >
                      Edit Draft
                    </Link>
                  )}

                  {!isDraft && processedJobs.length === 1 && (
                    <>
                      <Link
                        to={`/organizer/applications/${processedJobs[0].recruitmentId}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs lg:text-sm font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all shadow-sm whitespace-nowrap"
                      >
                        Applications
                        {totalNewApps > 0 && (
                          <span className="bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {totalNewApps}
                          </span>
                        )}
                      </Link>
                      <Link
                        to={`/organizer/recruitments/${processedJobs[0].recruitmentId}`}
                        className="px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold transition-all shadow-sm whitespace-nowrap bg-[#111827] text-white hover:bg-gray-800"
                      >
                        {groupedUI.buttonText}
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Positions list bên trong */}
              {processedJobs.length > 1 && (
                <div className="border-t border-gray-100">
                  <div className="px-5 lg:px-6 py-3 bg-gray-50/70">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={12} />
                      {processedJobs.length} Positions
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {processedJobs.map((job, index) => {
                      const posName = job.title?.split(' - ')?.slice(1)?.join(' - ') || job.title;
                      const posUI = getStatusUI(job.currentStatus);
                      const posProgress = job.total > 0 ? Math.min((job.currentCount / job.total) * 100, 100) : 0;
                      const posIsDraft = job.currentStatus === 'DRAFT';

                      return (
                        <div key={job.recruitmentId || index} className="px-5 lg:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#4a9e9e]/10 flex items-center justify-center shrink-0">
                              <Briefcase size={14} className="text-[#4a9e9e]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-800 text-sm truncate">{posName}</p>
                                {!posIsDraft && job.isNew && (
                                  <span className="bg-orange-100 text-orange-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                                    {job.newCount} NEW
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                  <span className={`w-1.5 h-1.5 rounded-full ${posUI.color}`}></span>
                                  {posUI.text}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  {job.currentCount} / {job.total} slots
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {!posIsDraft && (
                              <Link
                                to={`/organizer/applications/${job.recruitmentId}`}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all whitespace-nowrap"
                              >
                                Applications
                                {job.newCount > 0 && (
                                  <span className="bg-orange-500 text-white text-[9px] font-extrabold px-1 py-0.5 rounded-full min-w-[14px] text-center">
                                    {job.newCount}
                                  </span>
                                )}
                              </Link>
                            )}
                            <Link
                              to={`/organizer/recruitments/${job.recruitmentId}`}
                              className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                              Detail
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
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