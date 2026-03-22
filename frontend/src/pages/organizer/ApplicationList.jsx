import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, X, Download, CheckCircle, Quote, FileText, Star 
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; 
import axiosInstance from '../../config/axios';
import { message } from 'antd'; 

const ApplicationList = () => {
  const { recruitmentId } = useParams(); 
  
  const [applications, setApplications] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [recruitmentId]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`applications/recruitments/${recruitmentId}`);
      if (response.status === 200) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      message.error("Unable to load candidate list!");
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
      message.error("Unable to load candidate details!");
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/applications/${applicationId}/status`, { status: newStatus });
      
      if (response.status === 200) {
        message.success(`Successfully ${newStatus === 'APPROVED' ? 'approved' : 'rejected'} candidate!`);
        
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
      case 'PENDING': return <span className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-500 text-[10px] sm:text-xs font-bold rounded-full">Pending</span>;
      case 'APPROVED': return <span className="px-2 sm:px-3 py-1 bg-[#2dd4bf]/10 text-[#2dd4bf] text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">Approved</span>;
      case 'REJECTED': return <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-500 text-[10px] sm:text-xs font-bold rounded-full">Rejected</span>;
      default: return <span className="px-2 sm:px-3 py-1 bg-gray-50 text-gray-500 text-[10px] sm:text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#ecebe4] font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden relative">
        
        {/* Header & Toolbars */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 sm:mb-2">Application List</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Review and manage potential staff members.</p>
        </div>

        {/* Search & Actions - Responsive Stack */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 lg:mb-8 gap-4 sm:gap-0">
          <div className="w-full sm:max-w-xs lg:w-80">
            <div className="bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 sm:gap-3 w-full">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search candidates..." className="w-full outline-none text-xs sm:text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent"/>
            </div>
          </div>
          <Link 
            to={`/organizer/recruitments`} 
            className="w-full sm:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-md transition-all"
          >
             Back to Recruitments
          </Link>
        </div>

        {/* Table Container - Responsive Horizontal Scroll */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 lg:px-8 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">Candidate</th>
                  <th className="px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">Position Applied</th>
                  <th className="px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">Applied Date</th>
                  <th className="px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-4 lg:px-6 py-4 sm:py-5 text-[10px] lg:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-400 text-sm">Loading candidates...</td></tr>
                ) : applications.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-400 text-sm">No applications received yet.</td></tr>
                ) : (
                  applications.map((app) => (
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
                      <td className="px-4 lg:px-6 py-3 sm:py-4"><span className="text-xs sm:text-sm font-medium text-gray-500">{new Date(app.appliedDate).toLocaleDateString('en-GB')}</span></td>
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

      {/* MODAL - Candidate Details - Responsive */}
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

            {/* Modal Body - Stacks on mobile, Side-by-side on desktop */}
            <div className="flex-1 overflow-y-auto bg-[#f8f7f2] flex flex-col md:flex-row">
              
              {/* Left Column (Info) */}
              <div className="w-full md:w-5/12 p-4 sm:p-6 lg:p-8 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1 sm:mb-1.5">Email</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 break-all">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1 sm:mb-1.5">Phone</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">{selectedCandidate.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-6 sm:mb-8">
                  <h4 className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-800 mb-3 sm:mb-4"><Star size={16} className="text-[#2dd4bf] fill-[#2dd4bf]" /> Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full text-[10px] sm:text-xs font-bold text-gray-600 shadow-sm">Event Management</span>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-800 mb-3 sm:mb-4"><Quote size={16} className="text-[#2dd4bf]" /> Custom Answers</h4>
                  <div className="bg-[#ecebe4]/50 border border-[#ecebe4] p-4 sm:p-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    Waiting for custom form integration...
                  </div>
                </div>
              </div>

              {/* Right Column (CV) */}
              <div className="w-full md:w-7/12 p-4 sm:p-6 lg:p-8 bg-[#f4f3ed] flex flex-col h-64 md:h-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-700"><FileText size={18} className="text-[#8c9db3]" /> Curriculum Vitae Preview</div>
                  <button className="w-full sm:w-auto justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
                
                <div className="flex-1 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-3 sm:gap-4 text-gray-400 min-h-[200px] sm:min-h-[300px]">
                     <FileText size={40} className="text-gray-300 sm:w-12 sm:h-12"/>
                     <p className="font-bold text-xs sm:text-sm text-center px-4">Applicant hasn't uploaded a CV yet</p>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions - Stack on small screens */}
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 bg-white shrink-0">
              {selectedCandidate.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'REJECTED')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs sm:text-sm transition-colors"
                  >
                    Reject Application
                  </button>
                  
                  <button 
                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'APPROVED')}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-full bg-[#2dd4bf] hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <CheckCircle size={18} /> Approve Candidate
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