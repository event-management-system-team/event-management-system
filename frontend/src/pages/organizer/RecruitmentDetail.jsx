import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, Briefcase, FileText, CheckCircle, Edit
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import axiosInstance from '../../config/axios';

const RecruitmentDetail = () => {
  const { recruitmentId } = useParams();
  const navigate = useNavigate();
  
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosInstance.get(`event/recruitments/${recruitmentId}`);
        if (response.status === 200) {
          setDetailData(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi kéo chi tiết Job:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (recruitmentId) fetchDetail();
  }, [recruitmentId]);

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-gray-500 bg-[#f8f7f2]">Loading Data...</div>;
  if (!detailData) return <div className="flex h-screen items-center justify-center font-bold text-red-500 bg-[#f8f7f2]">Recruitment post not found!</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#ecebe4] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* HEADER RESPONSIVE */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-5 sm:py-8 shrink-0">
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors">
              <ArrowLeft size={16} /> Back to Recruitments
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{detailData.positionName}</h1>
                <span className={`px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-full whitespace-nowrap ${detailData.status === 'OPEN' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                  {detailData.status}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 font-medium flex items-center gap-2">
                <Briefcase size={16} className="shrink-0"/> <span className="truncate">{detailData.eventName}</span>
              </p>
            </div>
            
            <Link 
              to={`/organizer/recruitmentedit/${detailData.recruitmentId}`}
              className="w-full sm:w-auto justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-all"
            >
              <Edit size={16} /> Edit Post
            </Link>
          </div>
        </div>

        {/* NỘI DUNG CHI TIẾT RESPONSIVE */}
        <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full">
          
          {/* Hàng 1: Highlights (Quota & Deadline) - 1 cột trên Mobile, 2 cột trên PC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <Users size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Vacancy / Quota</p>
                <p className="text-lg sm:text-xl font-extrabold text-gray-800">{detailData.vacancy} people</p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 text-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Application Deadline</p>
                <p className="text-lg sm:text-xl font-extrabold text-gray-800">
                  {detailData.deadline ? new Date(detailData.deadline).toLocaleDateString('vi-VN') : 'No Deadline'}
                </p>
              </div>
            </div>
          </div>

          {/* Hàng 2: Description & Requirements */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Description Section */}
            <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FileText size={18} className="text-[#8c9db3] sm:w-5 sm:h-5" />
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Job Description</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {detailData.description || 'No detailed description provided for this position.'}
              </p>
            </div>

            {/* Requirements Section */}
            <div className="p-5 sm:p-6 lg:p-8 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CheckCircle size={18} className="text-teal-500 sm:w-5 sm:h-5" />
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Requirements</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {detailData.requirements || 'No specific requirements listed.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruitmentDetail;