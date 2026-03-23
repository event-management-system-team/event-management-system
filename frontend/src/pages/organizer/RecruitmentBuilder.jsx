import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Type, AlignLeft, UploadCloud, CheckSquare,
  FileText, Trash2, X, PlusCircle, Lock, Calendar, Clock,
  ChevronDown, ListChecks, Type as TypeIcon
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { Button } from 'antd';
// 1. IMPORT COMPONENT ALERT
import { Alert } from '../../components/common/Alert'; 

const RecruitmentFormBuilder = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formName, setFormName] = useState('Staff Application Form');
  const [formSchema, setFormSchema] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  
  // 2. THÊM STATE QUẢN LÝ ALERT
  const [appAlert, setAppAlert] = useState({ type: '', message: '' });

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // FETCH & NORMALIZE EXISTING FORM DATA
  useEffect(() => {
    const fetchExistingForm = async () => {
      try {
        const response = await axiosInstance.get(`/events/${eventId}/forms?type=RECRUITMENT`);

        if (response.status === 200 && response.data) {
          const dbData = response.data;
          if (dbData.message === "Chưa có form" || dbData.message === "No form found") return;

          setIsLocked(dbData.active === true || dbData.isActive === true || dbData.is_active === "true");
          setFormName(dbData.formName || dbData.form_name || "Staff Application Form");

          let schemaFromDB = dbData.formSchema || dbData.form_schema || [];
          if (typeof schemaFromDB === 'string') {
            schemaFromDB = JSON.parse(schemaFromDB);
          }

          if (schemaFromDB.length > 0 && schemaFromDB[0].type === 'Form_description') {
            schemaFromDB = schemaFromDB.slice(1);
          }

          // Chuẩn hóa dữ liệu cũ
          const normalizedSchema = schemaFromDB.map(item => {
            let newType = item.type;
            if (newType === 'SHORT_TEXT') newType = 'text';
            if (newType === 'LONG_TEXT') newType = 'paragraph';
            if (newType === 'SINGLE_CHOICE') newType = 'radio';
            if (newType === 'MULTIPLE_CHOICE') newType = 'checkbox';
            if (newType === 'DROPDOWN') newType = 'dropdown';
            if (newType === 'FILE_UPLOAD') newType = 'fileUpload';

            return {
              fieldId: item.fieldId || item.field_id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: newType,
              label: item.label || item.question || 'Untitled Question',
              required: item.required || false,
              placeholder: item.placeholder || '',
              options: item.options || [],
              maxChars: item.maxChars || (newType === 'paragraph' ? 500 : undefined)
            };
          });

          if (normalizedSchema.length > 0) {
            setFormSchema(normalizedSchema);
            setActiveId(normalizedSchema[0].fieldId);
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    if (eventId) fetchExistingForm();
  }, [eventId]);

  // UI HANDLERS
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
    let baseQuestion = { fieldId: newId, type: type, required: false, label: 'New Question' };

    if (type === 'text') {
      baseQuestion.label = 'Short Answer Question';
      baseQuestion.placeholder = 'Type short answer here...';
    } else if (type === 'paragraph') {
      baseQuestion.label = 'Paragraph Question';
      baseQuestion.placeholder = 'Type long answer here...';
      baseQuestion.maxChars = 500;
    } else if (type === 'fileUpload') {
      baseQuestion.label = 'Upload CV (PDF/Word)';
    } else if (['radio', 'checkbox', 'dropdown'].includes(type)) {
      baseQuestion.label = 'Select an option';
      baseQuestion.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    setFormSchema([...formSchema, baseQuestion]);
    setActiveId(newId);
  };

  const handleUpdateActiveQuestion = (key, value) => {
    if (isLocked) return;
    setFormSchema(formSchema.map(q => q.fieldId === activeId ? { ...q, [key]: value } : q));
  };

  const handleRemoveQuestion = (id) => {
    if (isLocked) return;
    const newSchema = formSchema.filter(q => q.fieldId !== id);
    setFormSchema(newSchema);
    setActiveId(newSchema.length > 0 ? newSchema[0].fieldId : null);
  };

  const handleSaveAction = async (isActive) => {
    // 3. KIỂM TRA LỖI BLANK TITLE
    if (!formName || formName.trim() === '') {
      setAppAlert({ 
        type: 'error', 
        message: 'Failed to create form because title is empty.' 
      });
      return; 
    }

    setAppAlert({ type: '', message: '' }); // Xoá cảnh báo nếu đã hợp lệ

    try {
      const payload = { 
        formName: formName.trim(),
        formType: "RECRUITMENT", 
        formSchema: formSchema,
        isActive: isActive
      };

      const response = await axiosInstance.post(`/events/${eventId}/forms`, payload);
      if (response.status === 200 || response.status === 201) {
        if (isActive) {
          setAppAlert({ type: 'success', message: "Recruitment form published successfully!" });
          setIsLocked(true);
        } else {
          setAppAlert({ type: 'success', message: "Draft saved successfully!" });
        }
      }
    } catch (error) {
      console.error("Error saving form:", error);
      setAppAlert({ type: 'error', message: "An error occurred while saving the form." });
    }
  };

  const activeQuestion = formSchema.find(q => q.fieldId === activeId);

  const getFormatTypeLabel = (type) => {
    const map = {
      'text': 'SHORT ANSWER',
      'paragraph': 'PARAGRAPH',
      'radio': 'SINGLE CHOICE',
      'checkbox': 'CHECKBOXES',
      'dropdown': 'DROPDOWN',
      'fileUpload': 'FILE UPLOAD'
    };
    return map[type] || type.toUpperCase();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="min-h-[64px] bg-white border-b border-gray-100 flex flex-wrap lg:flex-nowrap items-center justify-between px-4 lg:px-6 py-3 lg:py-0 shrink-0 z-10 shadow-sm gap-3 lg:gap-0">
          <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto">
            <Button onClick={() => navigate(-1)} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors border-none sm:border-solid shadow-none sm:shadow-sm px-2 sm:px-4">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to List</span>
            </Button>
            <div className="hidden sm:block w-px h-5 bg-gray-200"></div>
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight flex-1 lg:flex-none">Recruitment Form Builder</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto justify-end">
            {isLocked ? (
              <div className="px-3 sm:px-5 py-2 bg-gray-50 text-[#8c9db3] border border-[#8c9db3]/30 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed flex-1 lg:flex-none">
                <Lock size={14} /> <span className="hidden sm:inline">Form Published</span><span className="sm:hidden">Locked</span>
              </div>
            ) : (
              <>
                <button onClick={() => handleSaveAction(false)} className="text-xs sm:text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors flex-1 lg:flex-none py-2 text-center border sm:border-none border-gray-200 rounded-lg sm:rounded-none bg-white sm:bg-transparent">
                  Save Draft
                </button>
                <button onClick={() => handleSaveAction(true)} className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all flex-1 lg:flex-none">
                  Publish Form
                </button>
              </>
            )}
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">

          {/* CỘT 1: TOOLBOX CÂU HỎI */}
          <div className="w-full lg:w-56 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 p-4 lg:p-5 shrink-0 z-10 lg:overflow-y-auto">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 lg:mb-4">Form Elements</h3>
            <div className={`flex lg:block gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<TypeIcon size={16} />} label="Short Answer" onClick={() => handleAddQuestion('text')} /></div>
              <div className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<AlignLeft size={16} />} label="Paragraph" onClick={() => handleAddQuestion('paragraph')} /></div>
              <div className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<CheckSquare size={16} />} label="Single Choice" onClick={() => handleAddQuestion('radio')} /></div>
              <div className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<ListChecks size={16} />} label="Checkboxes" onClick={() => handleAddQuestion('checkbox')} /></div>
              <div className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<ChevronDown size={16} />} label="Dropdown" onClick={() => handleAddQuestion('dropdown')} /></div>
              <div className="shrink-0 w-44 lg:w-full snap-start mt-0 lg:mt-4 border-l lg:border-l-0 lg:border-t border-gray-100 pl-3 lg:pl-0 lg:pt-4"><ToolItem icon={<UploadCloud size={16} />} label="File Upload" onClick={() => handleAddQuestion('fileUpload')} /></div>
            </div>
          </div>

          {/* CỘT 2: FORM CANVAS */}
          <div className="w-full lg:flex-1 bg-[#ecebe4] p-4 sm:p-6 lg:p-8 lg:overflow-y-auto flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-6">

                <div className="h-20 sm:h-28 bg-[#8c9db3] relative flex justify-center">
                  <div className="absolute -bottom-5 sm:-bottom-6 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-[#8c9db3]">
                    <FileText size={24} className="sm:w-7 sm:h-7" />
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10 pt-10 sm:pt-12">
                  
                  {/* 4. HIỂN THỊ COMPONENT ALERT */}
                  <Alert 
                    type={appAlert.type} 
                    message={appAlert.message} 
                    onClose={() => setAppAlert({ type: '', message: '' })} 
                  />

                  {/* 5. INPUT HIỆN LỖI KHI BỎ TRỐNG */}
                  <div className="mb-8 lg:mb-10 text-center sm:text-left">
                    <input 
                      type="text" 
                      value={formName} 
                      disabled={isLocked} 
                      onChange={(e) => {
                        setFormName(e.target.value);
                        if (e.target.value.trim() !== '') {
                          setAppAlert({ type: '', message: '' }); // Xoá lỗi khi user nhập lại
                        }
                      }} 
                      className={`w-full text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 leading-tight outline-none bg-transparent rounded p-1 text-center sm:text-left transition-all ${
                        isLocked 
                          ? 'opacity-50 cursor-not-allowed border-transparent' 
                          : appAlert.type === 'error' && formName.trim() === ''
                            ? 'border border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                            : 'border border-transparent hover:bg-gray-50 focus:bg-gray-50'
                      }`} 
                      placeholder="Form Title" 
                    />
                  </div>

                  {formSchema.length === 0 ? (
                    <div className="text-center p-6 sm:p-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium text-sm sm:text-base">
                      Form is empty. Click a tool on the left to add a question!
                    </div>
                  ) : (
                    formSchema.map((item, index) => {
                      const isActive = item.fieldId === activeId;
                      return (
                        <div
                          key={item.fieldId} onClick={() => setActiveId(item.fieldId)}
                          draggable={!isLocked} onDragStart={() => (dragItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}
                          className={`relative p-4 sm:p-5 rounded-xl border-2 mb-4 sm:mb-5 cursor-pointer transition-colors ${isActive ? 'border-[#8c9db3] shadow-sm bg-[#f8fbff]' : 'border-transparent border-gray-100 hover:border-gray-200 bg-white'}`}
                        >
                          {isActive && <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#8c9db3] rounded-r"></div>}

                          <div className="block font-bold text-gray-800 mb-2 text-sm sm:text-base">{item.label} {item.required && <span className="text-red-500">*</span>}</div>

                          {['text', 'paragraph'].includes(item.type) && (
                            <div className="w-full bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-gray-400 shadow-inner">
                              {item.placeholder || 'Text input...'}
                            </div>
                          )}

                          {item.type === 'fileUpload' && (
                            <div className="p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                              <UploadCloud size={24} className="text-[#8c9db3] mb-2 sm:w-7 sm:h-7" />
                              <span className="text-xs sm:text-sm font-bold text-gray-700 mb-1">Upload your CV / Portfolio</span>
                              <span className="text-[10px] sm:text-xs font-medium text-gray-400 mb-3 sm:mb-4">PDF, DOC, DOCX (Max 5MB)</span>
                              <button disabled className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-[10px] sm:text-xs font-bold text-gray-500 shadow-sm cursor-not-allowed">Browse Files</button>
                            </div>
                          )}

                          {item.type === 'radio' && item.options?.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2 mb-1.5 sm:mb-2">
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white shrink-0"></div>
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">{opt}</span>
                            </div>
                          ))}

                          {item.type === 'checkbox' && item.options?.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2 mb-1.5 sm:mb-2">
                              <div className="w-3.5 h-3.5 rounded border border-gray-300 bg-white shrink-0"></div>
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">{opt}</span>
                            </div>
                          ))}

                          {item.type === 'dropdown' && (
                            <div className="w-full bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-gray-500 shadow-sm flex justify-between items-center">
                              <span>Choose an option</span>
                              <ChevronDown size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3: FIELD PROPERTIES */}
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-5 lg:p-6 shrink-0 z-10 flex flex-col shadow-none lg:shadow-[-4px_0_15px_rgba(0,0,0,0.02)] lg:overflow-y-auto">
            {activeQuestion ? (
              <div className={`${isLocked ? 'pointer-events-none opacity-60' : ''}`}>
                <div className="flex justify-between items-center mb-5 lg:mb-6 border-b border-gray-100 pb-3 lg:pb-4">
                  <h3 className="font-extrabold text-gray-900 text-base lg:text-lg">Field Properties</h3>
                  <span className="bg-[#f8fbff] text-[#8c9db3] border border-[#8c9db3]/30 text-[9px] lg:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {getFormatTypeLabel(activeQuestion.type)}
                  </span>
                </div>

                <div className="mb-5 lg:mb-6">
                  <div className="block text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question Label</div>
                  <textarea
                    readOnly={isLocked}
                    className="w-full border border-gray-100 rounded-lg lg:rounded-xl p-2.5 lg:p-3 text-xs lg:text-sm font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#8c9db3] resize-none h-16 lg:h-20 shadow-sm"
                    value={activeQuestion.label}
                    onChange={(e) => handleUpdateActiveQuestion('label', e.target.value)}
                  ></textarea>
                </div>

                {['text', 'paragraph'].includes(activeQuestion.type) && (
                  <div className="mb-5 lg:mb-6">
                    <div className="block text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Placeholder</div>
                    <input
                      type="text"
                      readOnly={isLocked}
                      className="w-full border border-gray-100 rounded-lg lg:rounded-xl p-2.5 lg:p-3 text-xs lg:text-sm font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#8c9db3] shadow-sm"
                      value={activeQuestion.placeholder || ''}
                      onChange={(e) => handleUpdateActiveQuestion('placeholder', e.target.value)}
                    />
                  </div>
                )}

                {activeQuestion.type === 'paragraph' && (
                  <div className="mb-5 lg:mb-6">
                    <div className="block text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Max Characters</div>
                    <input
                      type="number"
                      min="1"
                      readOnly={isLocked}
                      className="w-full border border-gray-100 rounded-lg lg:rounded-xl p-2.5 lg:p-3 text-xs lg:text-sm font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#8c9db3] shadow-sm"
                      value={activeQuestion.maxChars || ''}
                      onChange={(e) => handleUpdateActiveQuestion('maxChars', parseInt(e.target.value))}
                    />
                  </div>
                )}

                {['radio', 'checkbox', 'dropdown'].includes(activeQuestion.type) && (
                  <div className="mb-6 lg:mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="block text-[10px] lg:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Options</div>
                    <div className="space-y-2 mb-4">
                      {activeQuestion.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                          <input
                            type="text"
                            readOnly={isLocked}
                            value={opt}
                            onChange={(e) => { const newOpts = [...activeQuestion.options]; newOpts[i] = e.target.value; handleUpdateActiveQuestion('options', newOpts); }}
                            className="flex-1 p-2 text-sm outline-none font-medium text-gray-700 bg-transparent min-w-0"
                          />
                          {!isLocked && (
                            <button onClick={() => handleUpdateActiveQuestion('options', activeQuestion.options.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors shrink-0"><X size={16} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                    {!isLocked && (
                      <button onClick={() => handleUpdateActiveQuestion('options', [...(activeQuestion.options || []), `New Option`])} className="w-full py-2 sm:py-2.5 bg-white border border-gray-200 border-dashed rounded-lg text-xs lg:text-sm font-bold text-[#8c9db3] flex justify-center items-center gap-2 hover:bg-gray-50 transition-all"><PlusCircle size={16} /> Add Option</button>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center mb-6 lg:mb-8 py-3 lg:py-4 mt-auto bg-gray-50 px-4 rounded-xl border border-gray-100">
                  <span className="text-xs lg:text-sm font-bold text-gray-700">Required</span>
                  <div onClick={() => !isLocked && handleUpdateActiveQuestion('required', !activeQuestion.required)} className={`w-10 lg:w-11 h-5 lg:h-6 rounded-full relative cursor-pointer shadow-inner transition-colors shrink-0 ${activeQuestion.required ? 'bg-[#8c9db3]' : 'bg-gray-300'}`}>
                    <div className={`w-3.5 lg:w-4 h-3.5 lg:h-4 bg-white rounded-full absolute top-[3px] lg:top-1 transition-all shadow-sm ${activeQuestion.required ? 'left-[22px] lg:left-6' : 'left-1'}`}></div>
                  </div>
                </div>

                {!isLocked && (
                  <button onClick={() => handleRemoveQuestion(activeId)} className="w-full py-3 lg:py-3.5 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-red-50 shadow-sm transition-colors"><Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" /> Delete this question</button>
                )}
              </div>
            ) : <div className="text-center text-gray-400 mt-10 lg:mt-20 text-xs lg:text-sm font-medium">Please select a question to edit.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50 lg:bg-transparent">
    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-white lg:bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-500">{icon}</div>
    <span className="text-xs sm:text-sm font-bold text-gray-800 whitespace-nowrap">{label}</span>
  </div>
);

export default RecruitmentFormBuilder;