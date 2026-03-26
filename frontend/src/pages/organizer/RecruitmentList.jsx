import React, { useState, useEffect } from 'react';
import { Plus, Clock, Lock, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../config/axios';

const RecruitmentList = () => {
  const { t } = useTranslation();
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
          text: t('org_recr_recruiting'), 
          buttonText: t('org_recr_view_detail'), 
          isActive: true 
        };
      case 'CLOSED':
        return { 
          color: 'bg-red-400', 
          text: t('org_recr_closed'), 
          buttonText: t('org_recr_view_detail'), 
          isActive: true  // Organizer vẫn cần xem detail dù đã closed
        };
      default:
        return { 
          color: 'bg-gray-400', 
          text: status || t('org_recr_unknown'), 
          buttonText: t('org_recr_view_detail'), 
          isActive: true 
        };
    }
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return t('org_no_deadline');
    const d = new Date(dateString);
    return d.toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', 
      day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="flex min-h-screen bg-[#ecebe4] items-center justify-center font-bold text-gray-500 animate-pulse">{t('org_loading_recruitment')}</div>;
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-[#ecebe4] items-center justify-center flex-col gap-4">
        <p className="font-bold text-red-500 text-lg">{t('org_failed_load')}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold">{t('org_retry')}</button>
      </div>
    );
  }

  // Kiểm tra sự kiện đã kết thúc chưa
  const isEventEnded = dashboardData?.eventEndDate 
    ? new Date() > new Date(dashboardData.eventEndDate) 
    : false;

  const statsList = [
    { title: t('org_recr_active_roles'), value: dashboardData?.stats?.activeRoles || 0, color: "border-[#60a5fa]" },
    { title: t('org_recr_total_applicants'), value: dashboardData?.stats?.totalApplications || 0, color: "border-[#34d399]" },
    { title: t('org_recr_pending_review'), value: dashboardData?.stats?.pendingReviews || 0, color: "border-[#fb923c]" },
    { title: t('org_recr_hired_staff'), value: dashboardData?.stats?.hiredStaff || 0, color: "border-gray-300" }
  ];

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
            <h1 className="font-sans text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">{t('org_recr_title')}</h1>
            </button>
            <p className="text-gray-500 text-sm mt-1">{t('org_recr_subtitle')}</p>
          </div>
          
          {!isEventEnded ? (
            <Link 
              to={`/organizer/recruitment-post/${eventId}`} 
              className="w-full sm:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} /> {t('org_recr_create')}
            </Link>
          ) : (
            <div className="w-full sm:w-auto px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center gap-2 text-sm font-bold cursor-not-allowed shadow-sm">
              <Lock size={18} /> {t('org_recr_event_ended')}
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
              
              // --- XỬ LÝ LOGIC TRẠNG THÁI TRÊN FRONTEND ---
              const now = new Date();
              const isPastDeadline = job.deadline ? now > new Date(job.deadline) : false;
              
              let currentStatus = 'OPEN'; // Mặc định là đang tuyển
              
              // Ép cứng thành CLOSED nếu sự kiện đã kết thúc HOẶC đã quá hạn deadline
              if (isEventEnded || isPastDeadline) {
                currentStatus = 'CLOSED';
              }
              // ---------------------------------------------

              const ui = getStatusUI(currentStatus);
              const progressPercent = job.total > 0 ? Math.min((job.currentCount / job.total) * 100, 100) : 0;
              
              return (
                <div key={job.recruitmentId || index} className="bg-white rounded-xl lg:rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between border border-gray-100 hover:shadow-md transition-all group">
                  
                  {/* Cột 1: Tên & Tiến độ */}
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <h3 className="font-extrabold text-gray-900 text-base lg:text-lg ">{job.title}</h3>
                      {job.isNew && (
                        <span className="bg-orange-100 text-orange-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {job.newCount} {t('org_recr_new')}
                        </span>
                      )}
                    </div>
                    
                    <div className="w-full sm:max-w-xs">
                      <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1.5">
                        <span className="uppercase tracking-widest">{t('org_recr_hiring_progress')}</span>
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
                      <span className="truncate">{t('org_deadline_label')} <span className="text-gray-500 font-semibold">{formatDeadline(job.deadline)}</span></span>
                    </div>
                  </div>

                  {/* Cột 3: Nút bấm */}
                  <div className="w-full md:w-1/3 flex items-center justify-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-gray-50">
                    {/* Nút Applications */}
                    <Link
                      to={`/organizer/applications/${job.recruitmentId}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs lg:text-sm font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all shadow-sm whitespace-nowrap"
                    >
                      {t('org_recr_applications')}
                      {job.newCount > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {job.newCount}
                        </span>
                      )}
                    </Link>

                    {/* Nút View Detail */}
                    <Link
                      to={`/organizer/recruitments/${job.recruitmentId}`}
                      className="px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold transition-all shadow-sm whitespace-nowrap bg-[#111827] text-white hover:bg-gray-800"
                    >
                      {ui.buttonText}
                    </Link>
                  </div>

                </div>
              );
            })
          ) : (
             <div className="text-center p-16 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold mb-2">{t('org_recr_no_roles')}</p>
                <p className="text-gray-300 text-sm">{t('org_recr_click_create')}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentList;