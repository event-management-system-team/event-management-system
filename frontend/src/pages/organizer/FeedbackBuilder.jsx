import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smile, MessageSquare, Trash2, PlusCircle, X, Lock,
  Type as TypeIcon, AlignLeft, CheckSquare, ListChecks, ChevronDown, UploadCloud
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar'; 
import axiosInstance from '../../config/axios'; 

const FeedbackBuilder = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); 

  const [formName, setFormName] = useState('Event Feedback Form');
  // const [formDesc, setFormDesc] = useState('Please help us improve our future events by leaving your feedback.');
  
  // Khởi tạo mặc định theo schema mới
  const [formSchema, setFormSchema] = useState([
    { fieldId: 'q_1', type: 'NPS', label: 'How satisfied are you with the event?', required: true, leftLabel: 'Poor', rightLabel: 'Excellent' },
    { fieldId: 'q_2', type: 'paragraph', label: 'Any additional comments or suggestions?', required: false, maxChars: 500, placeholder: 'Type your answer here...' }
  ]);

  const [activeId, setActiveId] = useState('q_1');
  const [isLocked, setIsLocked] = useState(false);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    const fetchExistingForm = async () => {
      try {
        let actualEventName = "Event Feedback Form";
        try {
          const eventRes = await axiosInstance.get(`/events/${eventId}`);
          const eData = eventRes.data?.data || eventRes.data;
          if (eData && (eData.eventName || eData.title || eData.name)) {
            actualEventName = `Feedback: ${eData.eventName || eData.title || eData.name}`;
          }
        } catch {
          console.error("Could not fetch event name, using default.");
        }

        const response = await axiosInstance.get(`/events/${eventId}/forms?type=FEEDBACK`);

        if (response.status === 200 && response.data) {
          const dbData = response.data;
          
          const activeStatus = dbData.active ?? dbData.isActive ?? dbData.is_active;
          setIsLocked(activeStatus === true || activeStatus === "true");
          
          setFormName(dbData.formName || dbData.form_name || actualEventName);
          
          let schemaFromDB = dbData.formSchema || dbData.form_schema || [];
          if (typeof schemaFromDB === 'string') schemaFromDB = JSON.parse(schemaFromDB);

          if (schemaFromDB.length > 0 && schemaFromDB[0].type === 'Form_description') {
            // setFormDesc(schemaFromDB[0].content);
            schemaFromDB = schemaFromDB.slice(1);
          } else if (dbData.description) {
            // setFormDesc(dbData.description);
          }
          
          if (schemaFromDB.length > 0) {
            // Chuẩn hóa dữ liệu cũ sang schema mới
            const normalizedSchema = schemaFromDB.map(item => {
              let newType = item.type;
              // Map type cũ
              if (newType === 'SHORT_TEXT') newType = 'text';
              if (newType === 'LONG_TEXT' || newType === 'OPEN_COMMENT') newType = 'paragraph';
              if (newType === 'MULTIPLE_CHOICE') newType = 'radio';
              if (newType === 'CHECKBOX') newType = 'checkbox';
              if (newType === 'DROPDOWN') newType = 'dropdown';
              if (newType === 'FILE_UPLOAD') newType = 'fileUpload';

              return {
                fieldId: item.fieldId || item.field_id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: newType,
                label: item.label || item.question || 'Untitled Question',
                required: item.required || false,
                placeholder: item.placeholder || '',
                options: item.options || (['radio', 'checkbox', 'dropdown'].includes(newType) ? ['Option 1'] : []),
                maxChars: item.maxChars || (newType === 'paragraph' ? 500 : undefined),
                // Giữ lại props riêng của NPS
                ...(newType === 'NPS' && { leftLabel: item.leftLabel || 'Poor', rightLabel: item.rightLabel || 'Excellent' })
              };
            });

            setFormSchema(normalizedSchema);
            setActiveId(normalizedSchema[0].fieldId);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (eventId) fetchExistingForm();
  }, [eventId]);

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
      baseQuestion.label = 'Short Answer';
      baseQuestion.placeholder = 'Type short answer here...';
    } else if (type === 'paragraph') {
      baseQuestion.label = 'Long Answer';
      baseQuestion.placeholder = 'Type detailed answer here...';
      baseQuestion.maxChars = 500;
    } else if (type === 'NPS') {
      baseQuestion.label = 'How satisfied are you?';
      baseQuestion.leftLabel = 'Poor';
      baseQuestion.rightLabel = 'Excellent';
    } else if (['radio', 'checkbox', 'dropdown'].includes(type)) {
      baseQuestion.label = 'Select your option(s)';
      baseQuestion.options = ['Option 1', 'Option 2', 'Option 3'];
    } else if (type === 'fileUpload') {
      baseQuestion.label = 'Upload Document';
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
    if (activeId === id) setActiveId(newSchema[0]?.fieldId || null);
  };

  const handleUpdateOption = (index, newValue) => {
    if (isLocked) return;
    const activeQ = formSchema.find(q => q.fieldId === activeId);
    const newOptions = [...activeQ.options];
    newOptions[index] = newValue;
    handleUpdateActiveQuestion('options', newOptions);
  };

  const handleAddOption = () => {
    if (isLocked) return;
    const activeQ = formSchema.find(q => q.fieldId === activeId);
    handleUpdateActiveQuestion('options', [...activeQ.options, `Option ${activeQ.options.length + 1}`]);
  };

  const handleRemoveOption = (index) => {
    if (isLocked) return;
    const activeQ = formSchema.find(q => q.fieldId === activeId);
    const newOptions = activeQ.options.filter((_, i) => i !== index);
    handleUpdateActiveQuestion('options', newOptions);
  };

  const handleSaveAction = async (isActive) => {
    try {
      const payload = { 
        formName: formName,
        formType: "FEEDBACK",
        formSchema: [
          // { type: 'Form_description', content: formDesc },
          ...formSchema
        ],
        isActive: isActive
      };

      const response = await axiosInstance.post(`/events/${eventId}/forms`, payload);
      
      if (response.status === 200 || response.status === 201) {
        if (isActive) {
          alert("Form saved and published successfully!");
          setIsLocked(true);
        } else {
          alert("Draft saved successfully! (Not published yet)");
        }
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert("An error occurred while saving the form. Please try again.");
    }
  };

  const activeQuestion = formSchema.find(q => q.fieldId === activeId);
  const npsEmojis = ['😡', '😠', '😞', '🙁', '😐', '🙂', '😊', '😀', '😁', '😍'];

  const getFormatTypeLabel = (type) => {
    const map = {
      'text': 'SHORT ANSWER',
      'paragraph': 'PARAGRAPH',
      'radio': 'MULTIPLE CHOICE',
      'checkbox': 'CHECKBOXES',
      'dropdown': 'DROPDOWN',
      'fileUpload': 'FILE UPLOAD',
      'NPS': 'NPS RATING'
    };
    return map[type] || type.toUpperCase();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="min-h-[64px] bg-white border-b border-gray-200 flex flex-wrap lg:flex-nowrap items-center justify-between px-4 lg:px-6 py-3 lg:py-0 shrink-0 z-10 gap-3">
          <div className="flex items-center gap-3 lg:gap-6">  
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 lg:gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-5 lg:h-6 bg-gray-300"></div> 
            <h1 className="font-extrabold text-base lg:text-lg text-gray-900 tracking-tight">Feedback Form Builder</h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 w-full sm:w-auto justify-end">
            {isLocked ? (
              <div className="px-3 lg:px-5 py-1.5 lg:py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs lg:text-sm font-bold flex items-center gap-2 cursor-not-allowed w-full sm:w-auto justify-center">
                <Lock size={14} /> Form Published
              </div>
            ):(
              <>
                <button onClick={() => handleSaveAction(false)} className="px-3 lg:px-5 py-1.5 lg:py-2 bg-white border border-gray-300 rounded-lg text-xs lg:text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex-1 sm:flex-none text-center">
                  Save Draft
                </button>
                <button onClick={() => handleSaveAction(true)} className="px-3 lg:px-5 py-1.5 lg:py-2 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-xs lg:text-sm font-bold shadow-md transition-all flex-1 sm:flex-none text-center">
                  Publish
                </button>
              </>
            )}
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
          
          {/* CỘT 1: TOOLBOX */}
          <div className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 p-4 lg:p-6 shrink-0 z-10 lg:overflow-y-auto">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 lg:mb-4">Question Types</h3>
            <div className={`flex lg:block gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
              <div onClick={() => handleAddQuestion('text')} className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<TypeIcon size={18} className="text-gray-400"/>} title="Short Answer" desc="Small text field" /></div>
              <div onClick={() => handleAddQuestion('paragraph')} className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<AlignLeft size={18} className="text-gray-400"/>} title="Paragraph" desc="Long text area" /></div>
              <div onClick={() => handleAddQuestion('radio')} className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<CheckSquare size={18} className="text-gray-400"/>} title="Multiple Choice" desc="Select one option" /></div>
              <div onClick={() => handleAddQuestion('checkbox')} className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<ListChecks size={18} className="text-gray-400"/>} title="Checkboxes" desc="Select multiple options" /></div>
              <div onClick={() => handleAddQuestion('dropdown')} className="shrink-0 w-44 lg:w-full snap-start"><ToolItem icon={<ChevronDown size={18} className="text-gray-400"/>} title="Dropdown" desc="Select from list" /></div>
              
              <div className="shrink-0 w-full snap-start mt-0 lg:mt-4 border-l lg:border-l-0 lg:border-t border-gray-100 pl-3 lg:pl-0 lg:pt-4">
                <div onClick={() => handleAddQuestion('NPS')} className="w-44 lg:w-full"><ToolItem icon={<Smile size={18} className="text-gray-400" />} title="Satisfaction Scale" desc="1 to 10 Emoji rating" /></div>
              </div>
            </div>
          </div>

          {/* CỘT 2: CANVAS */}
          <div className="w-full lg:flex-1 p-3 sm:p-6 lg:p-8 lg:overflow-y-auto flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
                <div className="h-28 lg:h-40 bg-[#8c9db3] relative flex items-center justify-center px-4 text-center">
                  <h2 className="relative text-white text-2xl lg:text-3xl font-extrabold tracking-tight drop-shadow-md z-10">Event Feedback</h2>
                </div>

                <div className="p-5 sm:p-8 lg:p-10">
                  <div className="mb-8 lg:mb-10">
                    <input type="text" value={formName} disabled={isLocked} onChange={(e) => setFormName(e.target.value)} className={`w-full text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 border-none outline-none bg-transparent rounded p-1.5 ${isLocked ? 'opacity-80 cursor-not-allowed' : 'hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 focus:ring-[#8c9db3]/20'}`} />
                  </div>

                  {formSchema.map((item, index) => {
                    const isActive = item.fieldId === activeId;
                    return (
                      <div 
                        id={`question-${item.fieldId}`} key={item.fieldId} onClick={() => setActiveId(item.fieldId)}
                        draggable={!isLocked} onDragStart={() => (dragItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}
                        className={`relative p-5 lg:p-6 rounded-xl border-2 mb-5 lg:mb-6 cursor-pointer transition-all ${isActive ? 'border-[#8c9db3] bg-[#f8fbff] shadow-sm transform scale-[1.01]' : 'border-transparent border-gray-100 hover:border-gray-200'}`}
                      >
                        {isActive && <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#8c9db3] rounded-r"></div>}
                        
                        <h3 className="font-bold text-gray-800 mb-4 flex items-start text-base lg:text-lg leading-snug">
                          {item.label} {item.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>

                        {/* RENDER: TEXT / PARAGRAPH */}
                        {['text', 'paragraph'].includes(item.type) && (
                          <div className={`w-full bg-white border border-gray-200 rounded-xl p-3 lg:p-4 text-gray-400 text-xs lg:text-sm shadow-inner ${item.type === 'paragraph' ? 'h-20 lg:h-24 flex items-start' : ''}`}>
                            {item.placeholder || 'Your answer here...'}
                          </div>
                        )}

                        {/* RENDER: RADIO / CHECKBOX */}
                        {['radio', 'checkbox'].includes(item.type) && (
                          <div className="space-y-2 lg:space-y-3">
                            {item.options?.map((opt, i) => (
                              <div key={i} className="flex items-center gap-3 p-2.5 lg:p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                                <div className={`w-4 h-4 border-2 border-gray-300 shrink-0 ${item.type === 'radio' ? 'rounded-full' : 'rounded'}`}></div>
                                <span className="text-gray-700 font-medium text-sm">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* RENDER: DROPDOWN */}
                        {item.type === 'dropdown' && (
                          <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex justify-between items-center text-gray-500 text-sm font-medium">
                            <span>Choose an option</span>
                            <ChevronDown size={18} />
                          </div>
                        )}

                        {/* RENDER: NPS SCALE */}
                        {item.type === 'NPS' && (
                          <div className="mt-2">
                            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full gap-2 mb-3">
                              {npsEmojis.map((emoji, idx) => (
                                <div key={idx} className="w-[18%] sm:flex-1 flex flex-col items-center gap-1 group/emoji">
                                  <div className="text-2xl lg:text-3xl filter grayscale opacity-40 group-hover/emoji:grayscale-0 group-hover/emoji:opacity-100 transition-all duration-200 group-hover/emoji:scale-125 transform">{emoji}</div>
                                  <span className="text-[10px] lg:text-xs font-bold text-gray-400 mt-1">{idx + 1}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-[9px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1 lg:px-2 mt-4">
                              <span>{item.leftLabel || 'Poor'}</span>
                              <span>{item.rightLabel || 'Excellent'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3: FIELD PROPERTIES */}
          <div className="w-full lg:w-[340px] bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-5 lg:p-6 shrink-0 z-10 flex flex-col shadow-none lg:shadow-[-4px_0_15px_rgba(0,0,0,0.02)] lg:overflow-y-auto">
            {activeQuestion ? (
              <div className={isLocked ? 'opacity-50 pointer-events-none' : ''}>
                <div className="flex justify-between items-center mb-5 lg:mb-6 border-b border-gray-100 pb-3 lg:pb-4">
                  <h3 className="font-extrabold text-gray-900 text-base lg:text-lg">Field Properties</h3>
                  <span className="bg-[#f8fbff] text-[#8c9db3] border border-[#8c9db3]/20 text-[9px] lg:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {getFormatTypeLabel(activeQuestion.type)}
                  </span>
                </div>

                <div className="mb-5 lg:mb-6">
                  <div className="block text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question Label</div>
                  <textarea className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] resize-none h-20 shadow-sm"
                    value={activeQuestion.label} 
                    onChange={(e) => handleUpdateActiveQuestion('label', e.target.value)}
                    placeholder="Enter your question..."
                  ></textarea>
                </div>

                {['text', 'paragraph'].includes(activeQuestion.type) && (
                  <div className="mb-5 lg:mb-6">
                    <div className="block text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Placeholder</div>
                    <input type="text" className="w-full border-2 border-gray-100 rounded-xl p-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] shadow-sm" 
                      value={activeQuestion.placeholder || ''} 
                      onChange={(e) => handleUpdateActiveQuestion('placeholder', e.target.value)}
                    />
                  </div>
                )}

                {activeQuestion.type === 'paragraph' && (
                  <div className="mb-5 lg:mb-6">
                    <div className="block text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Max Characters</div>
                    <input type="number" min="1" className="w-full border-2 border-gray-100 rounded-xl p-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] shadow-sm" 
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
                        <div key={i} className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 focus-within:border-[#8c9db3] shadow-sm">
                          <input type="text" value={opt} onChange={(e) => handleUpdateOption(i, e.target.value)} className="flex-1 p-2 text-sm outline-none font-medium text-gray-700 bg-transparent min-w-0" />
                          <button onClick={() => handleRemoveOption(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddOption} className="w-full py-2.5 bg-white border border-gray-200 border-dashed rounded-lg text-sm font-bold text-[#8c9db3] flex items-center justify-center gap-2 hover:bg-[#f8fbff] transition-all">
                      <PlusCircle size={16} /> Add option
                    </button>
                  </div>
                )}

                {activeQuestion.type === 'NPS' && (
                  <div className="mb-6 lg:mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <div>
                      <div className="block text-[10px] lg:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Left Label (Score 1)</div>
                      <input type="text" value={activeQuestion.leftLabel} onChange={(e) => handleUpdateActiveQuestion('leftLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#8c9db3] shadow-sm" />
                    </div>
                    <div>
                      <div className="block text-[10px] lg:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Right Label (Score 10)</div>
                      <input type="text" value={activeQuestion.rightLabel} onChange={(e) => handleUpdateActiveQuestion('rightLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#8c9db3] shadow-sm" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6 lg:mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-auto">
                  <span className="text-sm font-bold text-gray-700">Required</span>
                  <Toggle active={activeQuestion.required} onClick={() => handleUpdateActiveQuestion('required', !activeQuestion.required)} />
                </div>

                <button onClick={() => handleRemoveQuestion(activeId)} className="w-full py-3.5 rounded-xl border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-sm">
                  <Trash2 size={18} /> Delete this question
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-20 text-sm font-medium">Please select a question to edit.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50 lg:bg-transparent">
    <div className="w-8 h-8 rounded-lg bg-white lg:bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h4 className="text-xs lg:text-sm font-bold text-gray-800 leading-tight truncate">{title}</h4>
      <p className="text-[10px] lg:text-[11px] text-gray-400 font-medium mt-0.5 truncate">{desc}</p>
    </div>
  </div>
);

const Toggle = ({ active, onClick }) => (
  <div onClick={onClick} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner shrink-0 ${active ? 'bg-[#8c9db3]' : 'bg-gray-300'}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${active ? 'left-6' : 'left-1'}`}></div>
  </div>
);

export default FeedbackBuilder;