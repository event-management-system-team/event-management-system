import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, Plus, Eye, Trash2, 
  X, Download, CheckCircle, Quote, FileText, Star 
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
      console.error("Lỗi tải danh sách ứng viên:", error);
      message.error("Không thể tải danh sách ứng viên!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/applications/${applicationId}/status`, { status: newStatus });
      
      if (response.status === 200) {
        message.success(`Đã ${newStatus === 'APPROVED' ? 'duyệt' : 'từ chối'} ứng viên thành công!`);
        
     
        setApplications(apps => apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
      
        if (selectedCandidate && selectedCandidate.id === applicationId) {
          setSelectedCandidate({ ...selectedCandidate, status: newStatus });
        }
        
   
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      message.error("Có lỗi xảy ra khi cập nhật!");
      const backendMessage = error.response?.data?.message || error.response?.data || error.message;
      message.error("Lỗi: " + backendMessage);
    }
  };


  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <span className="px-3 py-1 bg-orange-50 text-orange-500 text-xs font-bold rounded-full">Pending</span>;
      case 'APPROVED': return <span className="px-3 py-1 bg-[#2dd4bf]/10 text-[#2dd4bf] text-xs font-bold rounded-full uppercase tracking-wider">Approved</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full">Rejected</span>;
      default: return <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#ecebe4] font-sans">
      <Sidebar />

      <div className="flex-1 p-10 relative">
        {/* Header & Toolbars */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Application List</h1>
          <p className="text-gray-500 font-medium text-sm">Review and manage potential staff members.</p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-80">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search candidates..." className="w-full outline-none text-sm font-medium text-gray-700 placeholder-gray-400"/>
            </div>
              
          </div>
          <Link to={`/organizer/recruitments`} className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all">
             Back to Recruitments
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Position Applied</th>
                <th className="px-6 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Applied Date</th>
                <th className="px-6 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-400">Loading candidates...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-400">Chưa có ứng viên nào nộp đơn.</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <img src={app.avatar || `https://ui-avatars.com/api/?name=${app.name}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{app.name}</h4>
                          <p className="text-xs font-medium text-gray-400">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-700">{app.position}</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-medium text-gray-500">{new Date(app.appliedDate).toLocaleDateString('vi-VN')}</span></td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => setSelectedCandidate(app)}
                          className="text-gray-400 hover:text-teal-500 transition-colors p-1"
                        >
                          <Eye size={18} />
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

  
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-center gap-5">
                <img src={selectedCandidate.avatar || `https://ui-avatars.com/api/?name=${selectedCandidate.name}&background=random`} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white" />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-extrabold text-gray-900">{selectedCandidate.name}</h2>
                    {getStatusBadge(selectedCandidate.status)}
                  </div>
                  <p className="text-gray-400 font-medium">{selectedCandidate.position}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"><X size={24} /></button>
            </div>

            
            <div className="flex-1 overflow-y-auto bg-[#f8f7f2] flex flex-col md:flex-row">
              <div className="w-full md:w-5/12 p-8 border-r border-gray-200">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1.5">Email</p>
                    <p className="text-sm font-medium text-gray-800 break-words">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1.5">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{selectedCandidate.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-gray-800 mb-4"><Star size={16} className="text-[#2dd4bf] fill-[#2dd4bf]" /> Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    
                    <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm">Event Management</span>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-gray-800 mb-4"><Quote size={16} className="text-[#2dd4bf]" /> Custom Answers</h4>
                  <div className="bg-[#ecebe4]/50 border border-[#ecebe4] p-5 rounded-2xl text-sm text-gray-600 leading-relaxed font-medium">
                    
                    Đang chờ tích hợp câu trả lời từ Custom Form...
                  </div>
                </div>
              </div>

              
              <div className="w-full md:w-7/12 p-8 bg-[#f4f3ed] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-gray-700"><FileText size={18} className="text-[#8c9db3]" /> Curriculum Vitae Preview</div>
                  <button className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
                
                
                <div className="flex-1 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-4 text-gray-400 min-h-[300px]">
                     <FileText size={48} className="text-gray-300"/>
                     <p className="font-bold">Applicant hasn't uploaded a CV yet</p>
                </div>
              </div>
            </div>

            
           <div className="px-8 py-5 border-t border-gray-100 flex justify-end items-center gap-4 bg-white shrink-0">
              
              {selectedCandidate.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'REJECTED')}
                    className="px-6 py-2.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 font-bold text-sm transition-colors"
                  >
                    Reject Application
                  </button>
                  
                  <button 
                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'APPROVED')}
                    className="px-8 py-2.5 rounded-full bg-[#2dd4bf] hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5"
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