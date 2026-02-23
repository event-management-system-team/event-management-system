import React, { useState } from 'react';
import { 
  Search, ChevronDown, Plus, Eye, Trash2, ChevronLeft, ChevronRight, 
  X, Download, CheckCircle, XCircle, Star, Quote, FileText 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; 

const ApplicationList = () => {
  // Trạng thái quản lý việc mở/đóng cửa sổ Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Mock Data: Danh sách ứng viên
  const applications = [
    {
      id: 1,
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 234 567 890",
      position: "Event Coordinator Applicant",
      appliedDate: "Oct 24, 2024",
      experience: "2 Years Professional Experience",
      availability: "Full-time Available",
      status: "Approved",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 2,
      name: "Maria Gonzalez",
      email: "m.gonzalez@example.com",
      phone: "+1 987 654 321",
      position: "VIP Host",
      appliedDate: "Oct 22, 2024",
      experience: "4 Years",
      availability: "Part-time",
      status: "New",
      avatar: "https://i.pravatar.cc/150?img=9"
    }
    // Bạn có thể thêm các ứng viên khác tùy ý
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs font-bold rounded-full">New</span>;
      case 'Approved': return <span className="px-3 py-1 bg-[#2dd4bf]/10 text-[#2dd4bf] text-xs font-bold rounded-full uppercase tracking-wider">Approved</span>;
      case 'Interviewing': return <span className="px-3 py-1 bg-orange-50 text-orange-500 text-xs font-bold rounded-full">Interviewing</span>;
      default: return <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#ecebe4] font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 p-10 relative">
        {/* Header & Toolbars giữ nguyên */}
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
            <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-50 text-sm font-bold text-gray-600">
              Position <ChevronDown size={16} className="text-gray-400 ml-1" />
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-50 text-sm font-bold text-gray-600">
              Status <ChevronDown size={16} className="text-gray-400 ml-1" />
            </div>
          </div>
          <Link to="/organizer/recruitments/builder" className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all">
            <Plus size={18} strokeWidth={2.5} /> Create Form
          </Link>
        </div>

        {/* Bảng Dữ Liệu */}
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
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={app.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{app.name}</h4>
                        <p className="text-xs font-medium text-gray-400">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-gray-700">{app.position}</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-medium text-gray-500">{app.appliedDate}</span></td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* Sự kiện onClick để mở Modal */}
                      <button 
                        onClick={() => setSelectedCandidate(app)}
                        className="text-gray-300 hover:text-[#8c9db3] transition-colors p-1"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL CHI TIẾT ỨNG VIÊN (APPLICATION DETAIL) */}
      {/* ========================================= */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          
          {/* Hộp thoại Modal */}
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-center gap-5">
                <img src={selectedCandidate.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white" />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-extrabold text-gray-900">{selectedCandidate.name}</h2>
                    {getStatusBadge(selectedCandidate.status)}
                  </div>
                  <p className="text-gray-400 font-medium">{selectedCandidate.position}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body Modal (Chia 2 cột) */}
            <div className="flex-1 overflow-y-auto bg-[#f8f7f2] flex flex-col md:flex-row">
              
              {/* CỘT TRÁI: Thông tin cơ bản & Form answers */}
              <div className="w-full md:w-5/12 p-8 border-r border-gray-200">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1.5">Email</p>
                    <p className="text-sm font-medium text-gray-800">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1.5">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{selectedCandidate.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1.5">Experience</p>
                    <p className="text-sm font-medium text-gray-800">{selectedCandidate.experience}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#8c9db3] uppercase tracking-widest mb-1.5">Status</p>
                    <p className="text-sm font-medium text-[#2dd4bf]">{selectedCandidate.availability}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-gray-800 mb-4">
                    <Star size={16} className="text-[#2dd4bf] fill-[#2dd4bf]" /> Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Access Control', 'Conflict Resolution', 'Team Leadership', 'Crowd Management', 'First Aid'].map((skill) => (
                      <span key={skill} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Personal Statement */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-gray-800 mb-4">
                    <Quote size={16} className="text-[#2dd4bf]" /> Personal Statement
                  </h4>
                  <div className="bg-[#ecebe4]/50 border border-[#ecebe4] p-5 rounded-2xl text-sm text-gray-600 leading-relaxed font-medium">
                    I am a highly motivated and detail-oriented professional passionate about creating safe, engaging, and large-scale live event environments. Over the last two years, I have successfully managed crowd control and vendor coordination for festivals with over 5,000 attendees...
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: CV Preview */}
              <div className="w-full md:w-7/12 p-8 bg-[#f4f3ed]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-gray-700">
                    <FileText size={18} className="text-[#8c9db3]" /> Curriculum Vitae Preview
                  </div>
                  <button className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors">
                    <Download size={14} /> Download PDF
                  </button>
                </div>

                {/* Tờ giấy CV giả lập */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 h-[500px] overflow-y-auto w-full border-dashed border-2 border-gray-300">
                  <div className="text-center mb-8 border-b border-gray-100 pb-6">
                    <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-widest uppercase">{selectedCandidate.name}</h1>
                    <p className="text-xs text-gray-500 mt-2 font-serif italic">Los Angeles, CA • {selectedCandidate.email} • {selectedCandidate.phone}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-[#8c9db3] uppercase tracking-widest mb-3">Education</h3>
                    <p className="font-bold text-gray-800 text-sm">B.A. Event Management</p>
                    <p className="text-xs text-gray-500 font-serif italic">University of California, 2021</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#8c9db3] uppercase tracking-widest mb-3">Work Experience</h3>
                    <div className="mb-4">
                      <div className="flex justify-between items-end mb-1">
                        <p className="font-bold text-gray-800 text-sm">Assistant Coordinator</p>
                        <p className="text-[10px] text-gray-400 font-bold">2021 - Present</p>
                      </div>
                      <p className="text-xs text-gray-500 font-serif italic mb-2">Starlight Music Festival</p>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        <li>Lead volunteer training for 50+ staff members.</li>
                        <li>Maintained real-time communication between 12 departments.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal (Buttons) */}
            <div className="px-8 py-5 border-t border-gray-100 flex justify-end items-center gap-4 bg-white shrink-0">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="px-6 py-2.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 font-bold text-sm transition-colors"
              >
                Reject Application
              </button>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="px-8 py-2.5 rounded-full bg-[#2dd4bf] hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <CheckCircle size={18} /> Approve Candidate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationList;