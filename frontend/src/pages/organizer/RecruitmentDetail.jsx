import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, Briefcase, FileText, Gift, Edit,CheckCircle
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
    <div className="flex h-screen bg-[#ecebe4] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col  overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-10 py-8 shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors">
              <ArrowLeft size={16} /> Back to Recruitments
            </button>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{detailData.positionName}</h1>
                <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${detailData.status === 'OPEN' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                  {detailData.status}
                </span>
              </div>
              <p className="text-gray-500 font-medium flex items-center gap-2">
                <Briefcase size={16}/> {detailData.eventName}
              </p>
            </div>
            
            <Link 
              to={`/organizer/recruitmentedit/${detailData.recruitmentId}`}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-all"
            >
              <Edit size={16} /> Edit Post
            </Link>
          </div>
        </div>

        {/* NỘI DUNG CHI TIẾT */}
        <div className="p-10 max-w-5xl">
          
          {/* Hàng 1: Highlights (Quota & Deadline) */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vacancy / Quota</p>
                <p className="text-xl font-extrabold text-gray-800">{detailData.vacancy} people</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Application Deadline</p>
                <p className="text-xl font-extrabold text-gray-800">
                  {detailData.deadline ? new Date(detailData.deadline).toLocaleDateString('vi-VN') : 'No Deadline'}
                </p>
              </div>
            </div>
          </div>
          {/* Hàng 2: Description & Requirements */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Description Section */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-[#8c9db3]" />
                <h3 className="text-lg font-extrabold text-gray-900">Job Description</h3>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {detailData.description || 'No detailed description provided for this position.'}
              </p>
            </div>

            {/* Requirements Section */}
            <div className="p-8 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4">
                {/* Đổi icon thành CheckCircle cho hợp với Requirement */}
                <CheckCircle size={20} className="text-teal-500" />
                <h3 className="text-lg font-extrabold text-gray-900">Requirements</h3>
              </div>
              
              {/* Render trực tiếp chuỗi text, dùng whitespace-pre-line để giữ nguyên dấu xuống dòng */}
              <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
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