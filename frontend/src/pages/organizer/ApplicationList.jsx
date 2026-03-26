import React, { useState, useEffect } from 'react';
import {
  Search, Eye, X, Download, CheckCircle, Quote, FileText, Star, ArrowLeft, Filter
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../config/axios';
import { message } from 'antd';

const ApplicationList = () => {
  const { recruitmentId, eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [applications, setApplications] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States cho việc lọc dữ liệu
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [recruitmentId, eventId]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      let response;
      if (eventId) {
        response = await axiosInstance.get(`applications/events/${eventId}`);
      } else {
        response = await axiosInstance.get(`applications/recruitments/${recruitmentId}`);
      }
      if (response.status === 200) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      message.error(t('org_app_load_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/applications/${applicationId}`);
      if (response.status === 200) {
        setSelectedCandidate(response.data);
      }
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      message.error(t('org_app_detail_error'));
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/applications/${applicationId}/status`, { status: newStatus });

      if (response.status === 200) {
        message.success(newStatus === 'APPROVED' ? t('org_app_approved') : t('org_app_rejected'));

        setApplications(apps => apps.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));

        if (selectedCandidate && selectedCandidate.id === applicationId) {
          setSelectedCandidate({ ...selectedCandidate, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const backendMessage = error.response?.data?.message || error.response?.data || error.message;
      message.error("Error: " + backendMessage);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <span className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-500 text-[10px] sm:text-xs font-bold rounded-full">{t('org_status_pending')}</span>;
      case 'APPROVED': return <span className="px-2 sm:px-3 py-1 bg-[#2dd4bf]/10 text-[#2dd4bf] text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">{t('org_status_approved')}</span>;
      case 'REJECTED': return <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-500 text-[10px] sm:text-xs font-bold rounded-full">{t('org_status_rejected')}</span>;
      default: return <span className="px-2 sm:px-3 py-1 bg-gray-50 text-gray-500 text-[10px] sm:text-xs font-bold rounded-full">{status}</span>;
    }
  };

  // Logic Lọc Dữ Liệu
  const filteredApplications = applications.filter(app => {
    const matchSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || app.status?.toUpperCase() === statusFilter;

    const appDate = app.appliedAt ? new Date(app.appliedAt).toISOString().split('T')[0] : '';
    const matchDate = !dateFilter || appDate === dateFilter;

    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div className="flex flex-col min-h-screen w-full">

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden relative">

        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-gray-400 hover:text-gray-700 text-sm font-medium mb-3 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <h1 className="font-sans text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">{t('org_application_list')}</h1>
          </button>
          <p className="text-gray-500 text-sm mt-1">{t('org_app_review_desc')}</p>
        </div>

        {/* Search & Actions - Filter Section */}
        <div className="flex flex-col gap-4 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <div className="bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 sm:gap-3 flex-1 min-w-[200px]">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder={t('org_search_name_email')}
                  className="w-full outline-none text-xs sm:text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Filter size={18} className="text-gray-400 shrink-0" />
                <select
                  className="w-full sm:w-auto outline-none text-xs sm:text-sm font-medium text-gray-700 bg-transparent cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">{t('org_all_statuses')}</option>
                  <option value="PENDING">{t('org_status_pending')}</option>
                  <option value="APPROVED">{t('org_status_approved')}</option>
                  <option value="REJECTED">{t('org_status_rejected')}</option>
                </select>
              </div>

              <div className="bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <input
                  type="date"
                  className="w-full sm:w-auto outline-none text-xs sm:text-sm font-medium text-gray-700 bg-transparent cursor-pointer"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full lg:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-md transition-all shrink-0"
            >
              {t('org_back_to_recruitments')}
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="font-sans px-6 lg:px-8 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">{t('org_candidate')}</th>
                  <th className="font-sans px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">{t('org_position_applied')}</th>
                  <th className="font-sans px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">{t('org_applied_date')}</th>
                  <th className="font-sans px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">{t('org_status')}</th>
                  <th className="font-sans px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">{t('org_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-400 text-sm">{t('org_loading_candidates')}</td></tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10">
                      <p className="font-bold text-gray-400 text-sm">{t('org_no_applications')}</p>
                      {(searchTerm || statusFilter !== 'ALL' || dateFilter) && (
                        <button
                          onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter(''); }}
                          className="mt-2 text-[#2dd4bf] text-xs font-bold hover:underline"
                        >
                          {t('org_clear_filters')}
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img src={app.avatar || `https://ui-avatars.com/api/?name=${app.name}&background=random`} alt="Avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-gray-100 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{app.name}</h4>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400 truncate">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 sm:py-4"><span className="text-xs sm:text-sm font-bold text-gray-700">{app.position}</span></td>
                      <td className="px-4 lg:px-6 py-3 sm:py-4"><span className="text-xs sm:text-sm font-medium text-gray-500">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB') : 'N/A'}</span></td>
                      <td className="px-4 lg:px-6 py-3 sm:py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleViewDetail(app.id)}
                            className="text-gray-400 hover:text-teal-500 transition-colors p-1"
                          >
                            <Eye size={18} className="sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL - Candidate Details */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-[2rem] w-full w-[95%] sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-center gap-3 sm:gap-5">
                <img src={selectedCandidate.avatar || `https://ui-avatars.com/api/?name=${selectedCandidate.name}&background=random`} alt="Avatar" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-sm border-2 border-white shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900">{selectedCandidate.name}</h2>
                    {getStatusBadge(selectedCandidate.status)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">{selectedCandidate.position}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 sm:p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors shrink-0"><X size={20} className="sm:w-6 sm:h-6" /></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto bg-[#f8f7f2] flex flex-col md:flex-row">
              {(() => {
                // Lấy trực tiếp Object từ DTO (Backend trả về)
                const appData = selectedCandidate.applicationData || {};

                const phone = appData.phone || selectedCandidate.phone || 'N/A';
                const experience = appData.experience || "Chưa cập nhật kinh nghiệm.";
                const cvLink = appData.cv_link || selectedCandidate.resume || null;

                return (
                  <>
                    {/* Left Column (Info) */}
                    <div className="w-full md:w-5/12 p-4 sm:p-6 lg:p-8 border-b md:border-b-0 md:border-r border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div>
                          <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1 sm:mb-1.5">{t('org_email')}</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-800 break-all">{selectedCandidate.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1 sm:mb-1.5">{t('org_phone')}</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-800">{phone}</p>
                        </div>
                      </div>

                      {/* Experience (Từ DB) */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-800 mb-3 sm:mb-4">
                          <Star size={16} className="text-[#2dd4bf] fill-[#2dd4bf]" /> {t('org_experience_skills')}
                        </h4>
                        <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
                          {experience}
                        </div>
                      </div>

                      {/* Thông tin khác (Nếu có các field khác trong JSON) */}
                      {Object.keys(appData).filter(k => !['phone', 'experience', 'cv_link'].includes(k)).length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-800 mb-3 sm:mb-4">
                            <Quote size={16} className="text-[#2dd4bf]" /> {t('org_other_answers')}
                          </h4>
                          <div className="bg-[#ecebe4]/50 border border-[#ecebe4] p-4 sm:p-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                            {Object.entries(appData)
                              .filter(([key]) => !['phone', 'experience', 'cv_link'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="mb-2 last:mb-0">
                                  <span className="font-bold capitalize">{key}:</span> {value}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column (CV) */}
                    <div className="w-full md:w-7/12 p-4 sm:p-6 lg:p-8 bg-[#f4f3ed] flex flex-col h-64 md:h-auto">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-700">
                          <FileText size={18} className="text-[#8c9db3]" /> {t('org_curriculum_vitae')}
                        </div>
                        {cvLink && (
                          <a
                            href={cvLink.startsWith('http') ? cvLink : `https://${cvLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors"
                          >
                            <Download size={14} /> {t('org_open_cv_link')}
                          </a>
                        )}
                      </div>

                      <div className="flex-1 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-3 sm:gap-4 text-gray-400 min-h-[200px] sm:min-h-[300px]">
                        {cvLink ? (
                          <>
                            <CheckCircle size={40} className="text-[#2dd4bf] sm:w-12 sm:h-12" />
                            <p className="font-bold text-xs sm:text-sm text-center px-4 text-gray-600">
                              {t('org_cv_submitted')}
                              <br /><span className="text-gray-400 text-[10px] mt-1 inline-block">{t('org_cv_click_hint')}</span>
                            </p>
                          </>
                        ) : (
                          <>
                            <FileText size={40} className="text-gray-300 sm:w-12 sm:h-12" />
                            <p className="font-bold text-xs sm:text-sm text-center px-4">{t('org_no_cv')}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 bg-white shrink-0">
              {selectedCandidate.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'REJECTED')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs sm:text-sm transition-colors"
                  >
                    {t('org_reject_application')}
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'APPROVED')}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-full bg-[#2dd4bf] hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <CheckCircle size={18} /> {t('org_approve_candidate')}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;