import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Type, AlignLeft, UploadCloud, CheckSquare, 
  FileText, Trash2, X, PlusCircle, Lock, Calendar, Clock
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { Button } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RecruitmentFormBuilder = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formName, setFormName] = useState('Staff Application Form');
  const [formDesc, setFormDesc] = useState('Welcome! Please fill out the details below to apply.');
  const [formSchema, setFormSchema] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [deadlineTime, setDeadlineTime] = useState('23:59');

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // 1. FETCH EXISTING FORM DATA
  useEffect(() => {
    const fetchExistingForm = async () => {
      try {
        const response = await axiosInstance.get(`/events/${eventId}/forms?type=RECRUITMENT`);
        
        if (response.status === 200 && response.data) {
          const dbData = response.data;
          
          if(dbData.message === "Chưa có form" || dbData.message === "No form found") return; 

          setIsLocked(dbData.active === true || dbData.isActive === true || dbData.is_active === "true");
          setFormName(dbData.formName || dbData.form_name || "Staff Application Form");
          
          let schemaFromDB = dbData.formSchema || dbData.form_schema || [];
          if (typeof schemaFromDB === 'string') {
            schemaFromDB = JSON.parse(schemaFromDB);
          }

          if (schemaFromDB.length > 0 && schemaFromDB[0].type === 'Form_description') {
            setFormDesc(schemaFromDB[0].content);
            schemaFromDB = schemaFromDB.slice(1);
          } else if (dbData.description) {
            setFormDesc(dbData.description);
          }

          if (schemaFromDB.length > 0) {
            setFormSchema(schemaFromDB);
            setActiveId(schemaFromDB[0].field_id);
          }

          // Load deadline if exists
          if (dbData.deadline) {
            const deadlineDateTime = new Date(dbData.deadline);
            setDeadlineDate(deadlineDateTime);
            const hours = String(deadlineDateTime.getHours()).padStart(2, '0');
            const minutes = String(deadlineDateTime.getMinutes()).padStart(2, '0');
            setDeadlineTime(`${hours}:${minutes}`);
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    if (eventId) fetchExistingForm();
  }, [eventId]);

  // 2. UI HANDLERS (DRAG, ADD, EDIT, DELETE QUESTIONS)
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
    
    if (type === 'SHORT_TEXT') baseQuestion.question = 'Full Name / Phone Number';
    else if (type === 'LONG_TEXT') baseQuestion.question = 'Write your question here.';
    else if (type === 'FILE_UPLOAD') baseQuestion.question = 'Upload CV (PDF/Word)';
    else if (type === 'MULTIPLE_CHOICE') {
      baseQuestion.question = 'Write your question here.';
      baseQuestion.options = ['Option 1', 'Option 2', 'Option 3'];
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
    try {
      let formattedDeadline = null;
      if (deadlineDate && deadlineTime) {
        const year = deadlineDate.getFullYear();
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        formattedDeadline = `${year}-${month}-${day}T${deadlineTime}:00`;
      }
      const payload = { 
        formName: formName,
        formType: "RECRUITMENT", 
        formSchema: [
          { type: 'Form_description', content: formDesc },
          ...formSchema
        ],
        isActive: isActive,
        deadline: formattedDeadline
      };

      const response = await axiosInstance.post(`/events/${eventId}/forms`, payload);
      
      if (response.status === 200 || response.status === 201) {
        if (isActive) {
          alert("Recruitment form published successfully!");
          setIsLocked(true);
        } else {
          alert("Draft saved successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving form:", error);
      const errorMsg = error.response?.data || error.message;
      alert("An error occurred while saving the form: " + errorMsg);
    }
  };

  const activeQuestion = formSchema.find(q => q.field_id === activeId);

  return (
    <div className="flex h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col ">
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors">
              <ArrowLeft size={16} /> Back to List
            </Button>
            <div className="w-px h-5 bg-gray-200"></div>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Recruitment Form Builder</h1>
          </div>
          <div className="flex items-center gap-4">
            {isLocked ? (
              <>
              <div className="px-5 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-sm font-bold flex items-center gap-2 cursor-not-allowed">
                <Lock size={16} /> Form Published
              </div>
              <button 
                  onClick={() => handleSaveAction(true)} 
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold shadow-md transition-all"
                >
                  Update Deadline
                </button> 
                </>
            ) : (
              <>
                <button onClick={() => handleSaveAction(false)} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                  Save Draft
                </button>
                <button onClick={() => handleSaveAction(true)} className="px-5 py-2.5 bg-[#2dd4bf] hover:bg-[#14b8a6] text-white rounded-lg text-sm font-bold shadow-md transition-all">
                  Publish Form
                </button>
              </>
            )}
          </div>
        </header>


        <div className="flex-1 flex overflow-hidden">
          
          {/* CỘT 1: TOOLBOX CÂU HỎI */}
          <div className="w-56 bg-white border-r border-gray-100 p-5 overflow-y-auto shrink-0 z-10">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Form Elements</h3>
            <div className={`space-y-2 mb-8 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
              <ToolItem icon={<Type size={16} />} label="Short Answer" onClick={() => handleAddQuestion('SHORT_TEXT')} />
              <ToolItem icon={<AlignLeft size={16} />} label="Paragraph" onClick={() => handleAddQuestion('LONG_TEXT')} />
              <ToolItem icon={<UploadCloud size={16} />} label="File Upload" onClick={() => handleAddQuestion('FILE_UPLOAD')} />
              <ToolItem icon={<CheckSquare size={16} />} label="Multiple Choice" onClick={() => handleAddQuestion('MULTIPLE_CHOICE')} />
            </div>
          </div>

          {/* CỘT 2: FORM CANVAS (GIỮA) */}
          <div className="flex-1 bg-[#ecebe4] p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="h-28 bg-[#2dd4bf] relative flex justify-center">
                  <div className="absolute -bottom-6 w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-[#2dd4bf]">
                    <FileText size={28} />
                  </div>
                </div>
                <div className="p-10 pt-12">
                  <div className="mb-10">
                    <input type="text" value={formName} disabled={isLocked} onChange={(e) => setFormName(e.target.value)} className={`w-full text-2xl font-extrabold text-gray-900 mb-2 leading-tight border-none outline-none bg-transparent rounded p-1 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:bg-gray-50'}`} placeholder="Form Title" />
                    <textarea value={formDesc} disabled={isLocked} onChange={(e) => setFormDesc(e.target.value)} className={`w-full text-gray-500 font-medium leading-relaxed border-none outline-none bg-transparent resize-none overflow-hidden rounded p-1 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:bg-gray-50'}`} rows={2} placeholder="Form Description" />
                  </div>

                  {formSchema.length === 0 ? (
                    <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium">
                      Form is empty. Click a tool on the left to add a question!
                    </div>
                  ) : (
                    formSchema.map((item, index) => {
                      const isActive = item.field_id === activeId;
                      return (
                        <div 
                          key={item.field_id} onClick={() => setActiveId(item.field_id)}
                          draggable={!isLocked} onDragStart={() => (dragItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}
                          className={`relative p-5 rounded-xl border-2 mb-5 cursor-pointer transition-colors ${isActive ? 'border-[#2dd4bf] shadow-sm bg-[#f0fdfa]' : 'border-transparent border-gray-100 hover:border-gray-200 bg-white'}`}
                        >
                          {isActive && <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#2dd4bf] rounded-r"></div>}
                          <label className="block font-bold text-gray-800 mb-2 text-sm">{item.question} {item.required && <span className="text-red-500">*</span>}</label>
                          {['SHORT_TEXT', 'LONG_TEXT'].includes(item.type) && <div className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-400 shadow-inner">{item.placeholder || 'Text input...'}</div>}
                        {item.type === 'FILE_UPLOAD' && (
                          <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                            <UploadCloud size={28} className="text-[#2dd4bf] mb-2" />
                            <span className="text-sm font-bold text-gray-700 mb-1">Upload your CV / Portfolio</span>
                            <span className="text-xs font-medium text-gray-400 mb-4">PDF, DOC, DOCX (Max 5MB)</span>
                            <button 
                              disabled 
                              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 shadow-sm cursor-not-allowed"
                            >
                              Browse Files
                            </button>
                          </div>
                        )}                          
                        {item.type === 'MULTIPLE_CHOICE' && item.options?.map((opt, i) => <div key={i} className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded border border-gray-300 bg-white"></div><span className="text-xs text-gray-600 font-medium">{opt}</span></div>)}
                        </div>
                      );
                    })
                  )}

                  {/* DEADLINE SECTION */}
                  <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Clock size={20} className="text-[#2dd4bf]" />
                      <h3 className="text-lg font-bold text-gray-900">Application Deadline</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                        <div className="relative">
                          <DatePicker
                            selected={deadlineDate}
                            onChange={(date) => setDeadlineDate(date)}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Choose a date..."
                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#2dd4bf] shadow-sm"
                          />
                          <Calendar size={18} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Select Time</label>
                        <input
                          type="time"
                          value={deadlineTime}
                          onChange={(e) => setDeadlineTime(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#2dd4bf] shadow-sm"
                        />
                      </div>

                      {deadlineDate && (
                        <div className="bg-[#f0fdfa] border border-[#2dd4bf]/20 rounded-xl p-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-bold text-[#2dd4bf]">Application will close:</span>
                            <br/>
                            <span className="font-bold text-gray-900">{deadlineDate.toLocaleDateString('en-GB')} at {deadlineTime}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3: FIELD PROPERTIES (PHẢI) */}
          <div className="w-80 bg-white border-l border-gray-100 p-6 overflow-y-auto shrink-0 z-10 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
            {activeQuestion ? (
              <div className={`${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-extrabold text-gray-900 text-lg">Field Properties</h3>
                  <span className="bg-[#f0fdfa] text-[#2dd4bf] border border-[#2dd4bf]/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {activeQuestion.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question Text</label>
                  <textarea className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#2dd4bf] resize-none h-20 shadow-sm" value={activeQuestion.question} onChange={(e) => handleUpdateActiveQuestion('question', e.target.value)}></textarea>
                </div>

                {['SHORT_TEXT', 'LONG_TEXT'].includes(activeQuestion.type) && (
                  <div className="mb-6">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Placeholder</label>
                    <input type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#2dd4bf] shadow-sm" value={activeQuestion.placeholder || ''} onChange={(e) => handleUpdateActiveQuestion('placeholder', e.target.value)}/>
                  </div>
                )}

                {activeQuestion.type === 'MULTIPLE_CHOICE' && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Options</label>
                    <div className="space-y-2 mb-4">
                      {activeQuestion.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 focus-within:border-[#2dd4bf] shadow-sm">
                          <input type="text" value={opt} onChange={(e) => { const newOpts = [...activeQuestion.options]; newOpts[i] = e.target.value; handleUpdateActiveQuestion('options', newOpts); }} className="flex-1 p-2 text-sm outline-none font-medium text-gray-700 bg-transparent" />
                          <button onClick={() => handleUpdateActiveQuestion('options', activeQuestion.options.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleUpdateActiveQuestion('options', [...(activeQuestion.options || []), `New Option`])} className="w-full py-2.5 bg-white border border-gray-200 border-dashed rounded-lg text-sm font-bold text-[#2dd4bf] flex justify-center items-center gap-2 hover:bg-[#f0fdfa] transition-all"><PlusCircle size={16}/> Add Option</button>
                  </div>
                )}

                <div className="flex justify-between items-center mb-8 py-4 mt-auto bg-gray-50 px-4 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-700">Required</span>
                  <div onClick={() => handleUpdateActiveQuestion('required', !activeQuestion.required)} className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors ${activeQuestion.required ? 'bg-[#2dd4bf]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${activeQuestion.required ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>

                <button onClick={() => handleRemoveQuestion(activeId)} className="w-full py-3.5 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 shadow-sm transition-colors"><Trash2 size={18}/> Delete this question</button>
              </div>
            ) : <div className="text-center text-gray-400 mt-20 text-sm font-medium">Please select a question to edit.</div>}
          </div>

        </div>
      </div>
    </div>
  );
};

const ToolItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all">
    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-500">{icon}</div>
    <span className="text-sm font-bold text-gray-800">{label}</span>
  </div>
);

export default RecruitmentFormBuilder;