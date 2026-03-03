import React, { useState, useRef,useEffect } from 'react';
import { 
  ArrowLeft, Type, AlignLeft, UploadCloud, CheckSquare, 
  FileText, Info, Trash2, X, PlusCircle, Lock, Plus, Users, Briefcase
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { Button } from 'antd';

const RecruitmentFormBuilder = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formName, setFormName] = useState('Staff Application Form: BridgeFest 2025');
  const [formDesc, setFormDesc] = useState('Welcome! Please fill out the details below to apply.');
  const [formSchema, setFormSchema] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

 
  const [positions, setPositions] = useState([
    { id: 'pos_1', name: 'Security Guard', vacancy: 10 },
    { id: 'pos_2', name: 'Registration Desk', vacancy: 5 }
  ]);


  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {  
        const response = await axiosInstance.get(`/events/${eventId}/workspace`);
        if (response.status === 200 && response.data) {
          const { form, positions: dbPositions } = response.data;     
          if (dbPositions && dbPositions.length > 0) {
            const mappedPositions = dbPositions.map(p => ({
              id: p.id,
              name: p.positionName,
              vacancy: p.vacancy
            }));
            setPositions(mappedPositions);
          } else {
            setPositions([]); 
          }          
          if (form) {
            setFormName(form.formName || 'Staff Application Form');
            setIsLocked(form.isActive || form.is_active === "true");

            let schemaFromDB = form.formSchema || [];
            if (typeof schemaFromDB === 'string') schemaFromDB = JSON.parse(schemaFromDB);

            if (schemaFromDB.length > 0 && schemaFromDB[0].type === 'Form_description') {
              setFormDesc(schemaFromDB[0].content);
              schemaFromDB = schemaFromDB.slice(1);
            }

            if (schemaFromDB.length > 0) {
              setFormSchema(schemaFromDB);
              setActiveId(schemaFromDB[0].field_id);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi kéo dữ liệu Workspace:", error);
      }
    };

    if (eventId) fetchWorkspaceData();
  }, [eventId]);
 
  const handleAddPosition = () => {
    const newPos = { id: `pos_${Date.now()}`, name: '', vacancy: 1 };
    setPositions([newPos, ...positions]);
  };

  const handleUpdatePosition = (id, field, value) => {
    setPositions(positions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemovePosition = (id) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  // ================= CÁC HÀM XỬ LÝ FORM (NHƯ CŨ) =================
  const handleSort = () => {
    if (isLocked) return;
    let _formSchema = [...formSchema];
    const draggedItemContent = _formSchema.splice(dragItem.current, 1)[0];
    _formSchema.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFormSchema(_formSchema);
  };


  const handleAddQuestion = (type) => {
    if (isLocked) return;
    const newId = `q_${Date.now()}`;
    let baseQuestion = { field_id: newId, type: type, required: false, question: 'New Question', placeholder: 'Type here...' };
    
    if (type === 'SHORT_TEXT') baseQuestion.question = 'Họ và tên / SĐT';
    else if (type === 'LONG_TEXT') baseQuestion.question = 'Kinh nghiệm của bạn';
    else if (type === 'FILE_UPLOAD') baseQuestion.question = 'Upload CV (PDF)';
    else if (type === 'MULTIPLE_CHOICE') {
      baseQuestion.question = 'Ca làm việc mong muốn';
      baseQuestion.options = ['Sáng', 'Chiều'];
    }
    setFormSchema([...formSchema, baseQuestion]);
    setActiveId(newId);
  };

  const handleUpdateActiveQuestion = (key, value) => {
    if (isLocked) return;
    setFormSchema(formSchema.map(q => q.field_id === activeId ? { ...q, [key]: value } : q));
  };

  const handleRemoveQuestion = (id) => {
    if (isLocked) return;
    const newSchema = formSchema.filter(q => q.field_id !== id);
    setFormSchema(newSchema);
    setActiveId(newSchema.length > 0 ? newSchema[0].field_id : null);
  };


  const handleSaveAction = async (isActive) => {
    alert("Dữ liệu chuẩn bị gửi đi:\n1. Danh sách Vị trí: " + positions.length + " job\n2. Cấu trúc Form: " + formSchema.length + " câu hỏi");
    
    try {
      const payload = {
        formName: formName,
        formDescription: formDesc,
        formSchema: formSchema,
        isFormActive: isActive,
        
        positions: positions.map(p => ({
          id: p.id.startsWith('pos_') ? null : p.id, 
          name: p.name,
          vacancy: p.vacancy
        }))
      };
      const response = await axiosInstance.post(`/events/${eventId}/workspace`, payload);
      
      if (response.status === 200 || response.status === 201) {
        alert(isActive ? "Đã Publish toàn bộ vị trí và Form!" : "Đã lưu nháp Workspace!");
        if (isActive) setIsLocked(true);
      }
    } catch (error) {
      console.error("Lỗi khi lưu Workspace:", error);
      alert("Có lỗi xảy ra khi lưu!");
    }
  };

  const activeQuestion = formSchema.find(q => q.field_id === activeId);

  return (
    <div className="flex h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors">
              <ArrowLeft size={16} /> Back to List
            </Button>
            <div className="w-px h-5 bg-gray-200"></div>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Recruitment Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handleSaveAction(false)} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              Save Draft
            </button>
            <button onClick={() => handleSaveAction(true)} className="px-5 py-2.5 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-sm font-bold shadow-md transition-all">
              Publish All
            </button>
          </div>
        </header>

        {/* --- KHU VỰC 4 CỘT LÀM VIỆC --- */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CỘT 1 MỚI: QUẢN LÝ VỊ TRÍ (POSITIONS) */}
          <div className="w-64 bg-white border-r border-gray-100 p-5 overflow-y-auto shrink-0 z-10 flex flex-col">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={14}/> Positions
              </h3>
              <button onClick={handleAddPosition} className="w-6 h-6 rounded bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors">
                <Plus size={14} strokeWidth={3}/>
              </button>
            </div>
            
            <div className="space-y-3">
              {positions.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">Chưa có vị trí nào.</p>}
              {positions.map((pos) => (
                <div key={pos.id} className="relative group p-3 border border-gray-200 rounded-xl bg-gray-50 hover:border-teal-300 transition-colors">
                  <button onClick={() => handleRemovePosition(pos.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <X size={10} strokeWidth={3}/>
                  </button>
                  <input 
                    value={pos.name} onChange={(e) => handleUpdatePosition(pos.id, 'name', e.target.value)}
                    className="w-full text-sm font-bold bg-transparent outline-none mb-2 text-gray-800 placeholder-gray-300" 
                    placeholder="Tên vị trí (VD: Lễ tân)"
                  />
                  <div className="flex items-center text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg p-1.5 w-max">
                    <Users size={12} className="mr-1.5 text-gray-400"/> Quota:
                    <input 
                      type="number" min="1" value={pos.vacancy} onChange={(e) => handleUpdatePosition(pos.id, 'vacancy', e.target.value)}
                      className="w-10 ml-2 bg-transparent outline-none text-teal-600"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-6">
               <div className="bg-[#f8f7f2] rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] text-gray-500 font-medium">Bạn có thể tạo nhiều vị trí tuyển dụng. Tất cả sẽ dùng chung Form ứng tuyển ở bên phải.</p>
              </div>
            </div>
          </div>

          {/* CỘT 2: TOOLBOX CÂU HỎI */}
          <div className="w-56 bg-white border-r border-gray-100 p-5 overflow-y-auto shrink-0 z-10">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Form Elements</h3>
            <div className="space-y-2 mb-8">
              <ToolItem icon={<Type size={16} />} label="Short Answer" onClick={() => handleAddQuestion('SHORT_TEXT')} />
              <ToolItem icon={<AlignLeft size={16} />} label="Paragraph" onClick={() => handleAddQuestion('LONG_TEXT')} />
              <ToolItem icon={<UploadCloud size={16} />} label="File Upload" onClick={() => handleAddQuestion('FILE_UPLOAD')} />
              <ToolItem icon={<CheckSquare size={16} />} label="Multiple Choice" onClick={() => handleAddQuestion('MULTIPLE_CHOICE')} />
            </div>
          </div>

          {/* CỘT 3: FORM CANVAS (GIỮA) */}
          <div className="flex-1 bg-[#ecebe4] p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="h-28 bg-[#8c9db3] relative flex justify-center">
                  <div className="absolute -bottom-6 w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-[#8c9db3]">
                    <FileText size={28} />
                  </div>
                </div>
                <div className="p-10 pt-12">
                  <div className="mb-10">
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full text-2xl font-extrabold text-gray-900 mb-2 leading-tight border-none outline-none bg-transparent" placeholder="Form Title" />
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full text-gray-500 font-medium leading-relaxed border-none outline-none bg-transparent resize-none overflow-hidden" rows={2} placeholder="Form Description" />
                  </div>

                  {formSchema.length === 0 ? (
                    <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium">
                      Form đang trống. Click vào công cụ bên trái!
                    </div>
                  ) : (
                    formSchema.map((item, index) => {
                      const isActive = item.field_id === activeId;
                      return (
                        <div 
                          key={item.field_id} onClick={() => setActiveId(item.field_id)}
                          draggable={!isLocked} onDragStart={() => (dragItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}
                          className={`relative p-5 rounded-xl border-2 mb-5 cursor-pointer transition-colors ${isActive ? 'border-[#2dd4bf] shadow-sm bg-white' : 'border-transparent hover:border-gray-200 bg-white'}`}
                        >
                          {isActive && <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#2dd4bf] rounded-r"></div>}
                          <label className="block font-bold text-gray-800 mb-2 text-sm">{item.question} {item.required && <span className="text-red-500">*</span>}</label>
                          {['SHORT_TEXT', 'LONG_TEXT'].includes(item.type) && <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-400">{item.placeholder || 'Text input...'}</div>}
                          {item.type === 'FILE_UPLOAD' && <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center text-xs text-gray-400"><UploadCloud size={20} className="mx-auto mb-1"/> Upload File Here</div>}
                          {item.type === 'MULTIPLE_CHOICE' && item.options?.map((opt, i) => <div key={i} className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded border border-gray-300"></div><span className="text-xs text-gray-600">{opt}</span></div>)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 4: FIELD PROPERTIES (PHẢI) */}
          <div className="w-72 bg-white border-l border-gray-100 p-5 overflow-y-auto shrink-0 z-10 flex flex-col">
            {activeQuestion ? (
              <>
                <h3 className="font-extrabold text-gray-900 mb-6">Field Properties</h3>
                <div className="mb-5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Question Title</label>
                  <textarea className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-gray-700 outline-none focus:border-[#2dd4bf] resize-none h-16" value={activeQuestion.question} onChange={(e) => handleUpdateActiveQuestion('question', e.target.value)}></textarea>
                </div>
                {['SHORT_TEXT', 'LONG_TEXT'].includes(activeQuestion.type) && (
                  <div className="mb-5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Placeholder</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium text-gray-500 outline-none focus:border-[#2dd4bf]" value={activeQuestion.placeholder || ''} onChange={(e) => handleUpdateActiveQuestion('placeholder', e.target.value)}/>
                  </div>
                )}
                {activeQuestion.type === 'MULTIPLE_CHOICE' && (
                  <div className="mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Options</label>
                    {activeQuestion.options?.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 mb-2">
                        <input type="text" value={opt} onChange={(e) => { const newOpts = [...activeQuestion.options]; newOpts[i] = e.target.value; handleUpdateActiveQuestion('options', newOpts); }} className="flex-1 p-1 text-xs outline-none font-medium" />
                        <button onClick={() => handleUpdateActiveQuestion('options', activeQuestion.options.filter((_, idx) => idx !== i))} className="p-1 text-red-400"><X size={12}/></button>
                      </div>
                    ))}
                    <button onClick={() => handleUpdateActiveQuestion('options', [...(activeQuestion.options || []), `Lựa chọn mới`])} className="w-full py-1.5 bg-white border border-gray-200 border-dashed rounded text-[10px] font-bold text-teal-500 flex justify-center items-center gap-1"><PlusCircle size={12}/> Add Option</button>
                  </div>
                )}
                <div className="flex justify-between items-center mb-5 py-4 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-700">Required</span>
                  <div onClick={() => handleUpdateActiveQuestion('required', !activeQuestion.required)} className={`w-10 h-5 rounded-full relative cursor-pointer ${activeQuestion.required ? 'bg-[#2dd4bf]' : 'bg-gray-300'}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${activeQuestion.required ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
                <button onClick={() => handleRemoveQuestion(activeId)} className="mt-auto w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100"><Trash2 size={16}/> Delete</button>
              </>
            ) : <div className="text-center text-gray-400 mt-10 text-xs font-medium">Select a field to edit</div>}
          </div>

        </div>
      </div>
    </div>
  );
};

const ToolItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border border-transparent hover:bg-gray-50 hover:border-gray-200">
    <div className="text-gray-400">{icon}</div>
    <span className="text-xs font-bold text-gray-700">{label}</span>
  </div>
);

export default RecruitmentFormBuilder;