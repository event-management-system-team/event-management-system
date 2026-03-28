import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, Briefcase, FileText, CheckCircle, Edit, ClipboardList, Gift, Pencil, X, Check
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../../config/axios';

const getStatusBadge = (status) => {
  const s = status?.toUpperCase();
  switch (s) {
    case 'OPEN':
      return { text: 'Recruiting', className: 'bg-teal-100 text-teal-700' };
    case 'DRAFT':
      return { text: 'Draft', className: 'bg-yellow-100 text-yellow-700' };
    case 'CLOSED':
      return { text: 'Closed', className: 'bg-red-100 text-red-600' };
    default:
      return { text: status || 'Unknown', className: 'bg-gray-100 text-gray-600' };
  }
};

const RecruitmentDetail = () => {
  const { recruitmentId } = useParams();
  const navigate = useNavigate();
  
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Change deadline state
  const [showDeadlineEditor, setShowDeadlineEditor] = useState(false);
  const [newDeadline, setNewDeadline] = useState(null);
  const [isSavingDeadline, setIsSavingDeadline] = useState(false);
  const [deadlineError, setDeadlineError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosInstance.get(`recruitments/${recruitmentId}/detail`);
        if (response.status === 200) {
          setDetailData(response.data);
          if (response.data.deadline) setNewDeadline(new Date(response.data.deadline));
        }
      } catch (error) {
        console.error("Lỗi khi kéo chi tiết Job:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (recruitmentId) fetchDetail();
  }, [recruitmentId]);

  // Deadline tối đa: trước ngày sự kiện bắt đầu 1 ngày
  const maxDeadline = detailData?.eventStartDate
    ? (() => {
        const d = new Date(detailData.eventStartDate);
        d.setDate(d.getDate() - 1);
        return d;
      })()
    : null;

  const handleSaveDeadline = async () => {
    if (!newDeadline) { setDeadlineError('Please select a new deadline.'); return; }
    if (newDeadline <= new Date()) { setDeadlineError('Deadline must be in the future.'); return; }

    if (maxDeadline && newDeadline > maxDeadline) {
      setDeadlineError(`Deadline must be before event start date (${maxDeadline.toLocaleDateString('en-GB')}).`);
      return;
    }

    setDeadlineError('');
    setIsSavingDeadline(true);
    try {
      await axiosInstance.put(`recruitments/${recruitmentId}`, {
        deadline: newDeadline.toISOString(),
      });
      setDetailData(prev => ({ ...prev, deadline: newDeadline.toISOString() }));
      setShowDeadlineEditor(false);
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || 'Failed to update deadline. Please try again.';
      setDeadlineError(msg);
    } finally {
      setIsSavingDeadline(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-gray-500 bg-[#F1F0E8]">Loading Data...</div>;
  if (!detailData) return <div className="flex h-screen items-center justify-center font-bold text-red-500 bg-[#F1F0E8]">Recruitment post not found!</div>;

  const statusBadge = getStatusBadge(detailData.status);
  const canEditDeadline = detailData.status === 'OPEN' || detailData.status === 'CLOSED';

  const handleEdit = () => {
    navigate(`/organizer/recruitment-post/${detailData.eventId}`, {
      state: { recruitmentId }
    });
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* HEADER */}
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
                <span className={`px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-full whitespace-nowrap ${statusBadge.className}`}>
                  {statusBadge.text}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 font-medium flex items-center gap-2">
                <Briefcase size={16} className="shrink-0"/> <span className="truncate">{detailData.eventName}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                to={`/organizer/applications/${recruitmentId}`}
                className="w-full sm:w-auto justify-center flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
              >
                <ClipboardList size={16} /> View Applications
              </Link>

              {detailData.status === 'DRAFT' && (
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto justify-center flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <Edit size={16} /> Edit Post
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full">
          
          {/* Highlights */}
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

            {/* Deadline Card — with inline editor */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 text-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                  <Calendar size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Application Deadline</p>
                    {canEditDeadline && !showDeadlineEditor && (
                      <button
                        onClick={() => setShowDeadlineEditor(true)}
                        className="flex items-center gap-1 text-[10px] text-[#4a9e9e] hover:text-[#3d8f8f] font-semibold transition-colors shrink-0"
                      >
                        <Pencil size={11} /> Change
                      </button>
                    )}
                  </div>
                  {!showDeadlineEditor ? (
                    <p className="text-lg sm:text-xl font-extrabold text-gray-800">
                      {detailData.deadline ? new Date(detailData.deadline).toLocaleDateString('en-GB') : 'No Deadline'}
                    </p>
                  ) : (
                    <div className="mt-1 space-y-2">
                      <DatePicker
                        selected={newDeadline}
                        onChange={setNewDeadline}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        maxDate={maxDeadline}
                        placeholderText="Pick new deadline"
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]"
                        wrapperClassName="w-full"
                      />
                      {deadlineError && <p className="text-xs text-red-500">{deadlineError}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDeadline}
                          disabled={isSavingDeadline}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4a9e9e] text-white text-xs font-bold rounded-lg hover:bg-[#3d8f8f] transition disabled:opacity-60"
                        >
                          <Check size={12} /> {isSavingDeadline ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => { setShowDeadlineEditor(false); setDeadlineError(''); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description, Requirements, Benefits */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FileText size={18} className="text-[#8c9db3] sm:w-5 sm:h-5" />
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Job Description</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {detailData.description || 'No detailed description provided for this position.'}
              </p>
            </div>

            <div className={`p-5 sm:p-6 lg:p-8 bg-gray-50/50 ${detailData.benefits?.length > 0 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CheckCircle size={18} className="text-teal-500 sm:w-5 sm:h-5" />
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Requirements</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {detailData.requirements || 'No specific requirements listed.'}
              </p>
            </div>

            {detailData.benefits?.length > 0 && (
              <div className="p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Gift size={18} className="text-purple-500 sm:w-5 sm:h-5" />
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Benefits</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailData.benefits.map((b, i) => (
                    <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                      {typeof b === 'string' ? b : b.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruitmentDetail;