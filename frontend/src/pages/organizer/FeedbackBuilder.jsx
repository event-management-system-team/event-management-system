import React, {useState} from 'react';
import {useParams,  useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Hash, List as ListIcon, Smile, MessageSquare,
  Minus, Trash2, Heart, ThumbsUp, PlusCircle, X,Lock
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar'; 
import  axiosInstance  from '../../config/axios'; 



const FeedbackBuilder = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); 

  const [formName, setFormName] = useState('Feedback Form: Giao lưu Văn hóa');
  const [formDesc, setFormDesc] = useState('Hãy giúp chúng tôi cải thiện sự kiện cho lần sau bằng cách để lại đánh giá của bạn.');
  
  const [formSchema, setFormSchema] = useState([
    { field_id: 'q_1', type: 'NPS', question: 'Mức độ hài lòng của bạn về sự kiện?', required: true, leftLabel: 'Rất tệ', rightLabel: 'Tuyệt vời' }
  ]);

  const [activeId, setActiveId] = useState('q_1');

  const [isLocked,setIsLocked]=useState(false);


  React.useEffect(() => {
    const fetchExistingForm = async () => {
      try {
        console.log("1. Đang gọi API lấy dữ liệu cho Event ID:", eventId);
        const response = await axiosInstance.get(`/events/${eventId}/forms?type=FEEDBACK`);
        
     
        console.log("2. Dữ liệu Backend trả về:", response.data); 

        if (response.status === 200 && response.data) {
          const dbData = response.data;
          
          if(dbData.isActive === true || dbData.is_active === "true"){
            setIsLocked(true);
          }else{
            setIsLocked(false);
          }
          
          
          const name = dbData.formName || dbData.form_name || "Feedback Form: Giao lưu Văn hóa";
          setFormName(name);
          
          let schemaFromDB = dbData.formSchema || dbData.form_schema || [];

          
          console.log("3. Schema lấy được:", schemaFromDB);
          
      
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
            console.log("4. Đã render dữ liệu lên màn hình thành công!");
          } else {
          
            setFormSchema([
              { field_id: 'q_1', type: 'NPS', question: 'Mức độ hài lòng của bạn về sự kiện?', required: true, leftLabel: 'Rất tệ', rightLabel: 'Tuyệt vời' }
            ]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi kéo dữ liệu:", error);
      }
    };

    if (eventId) {
      fetchExistingForm();
    }
  }, [eventId]);

  const handleAddQuestion = (type) => {
    if (isLocked) return;
    const newId = `q_${Date.now()}`;
    let baseQuestion = { field_id: newId, type: type, required: false };

    if (type === 'OPEN_COMMENT') {
      baseQuestion.question = 'Nhập câu hỏi tự luận của bạn...';
    } else if (type === 'NPS') {
      baseQuestion.question = 'Mức độ hài lòng của bạn về sự kiện?';
      baseQuestion.leftLabel = 'Rất tệ';
      baseQuestion.rightLabel = 'Tuyệt vời';
    } else if (type === 'MULTIPLE_CHOICE') {
      baseQuestion.question = 'Bạn biết đến sự kiện qua kênh nào?';
      baseQuestion.options = ['Facebook', 'Email', 'Bạn bè giới thiệu'];
    }

    setFormSchema([...formSchema, baseQuestion]);
    setActiveId(newId);
  };

  const handleUpdateActiveQuestion = (key, value) => {
    if (isLocked) return;
    setFormSchema(formSchema.map(q => 
      q.field_id === activeId ? { ...q, [key]: value } : q
    ));
  };

  const handleRemoveQuestion = (id) => {
    if (isLocked) return;
    const newSchema = formSchema.filter(q => q.field_id !== id);
    setFormSchema(newSchema);
    if (activeId === id) setActiveId(newSchema[0]?.field_id || null);
  };

  const handleUpdateOption = (index, newValue) => {
    if (isLocked) return;
    const activeQ = formSchema.find(q => q.field_id === activeId);
    const newOptions = [...activeQ.options];
    newOptions[index] = newValue;
    handleUpdateActiveQuestion('options', newOptions);
  };

  const handleAddOption = () => {
    if (isLocked) return;
    const activeQ = formSchema.find(q => q.field_id === activeId);
    handleUpdateActiveQuestion('options', [...activeQ.options, `Lựa chọn ${activeQ.options.length + 1}`]);
  };

  const handleRemoveOption = (index) => {
    if (isLocked) return;
    const activeQ = formSchema.find(q => q.field_id === activeId);
    const newOptions = activeQ.options.filter((_, i) => i !== index);
    handleUpdateActiveQuestion('options', newOptions);
  };

  const handleSaveAction = async (isActive) => {
  try {
    const payload = { 
      formName: formName,
      formType: "FEEDBACK",
      formSchema: [
        { type: 'Form_description', content: formDesc },
        ...formSchema
      ],
      isActive: isActive
    };

    const response = await axiosInstance.post(`/events/${eventId}/forms`, payload);
    
    if (response.status === 200 || response.status === 201) {
      if (isActive) {
        alert("Form đã được lưu và kích hoạt thành công!");
        setIsLocked(true);
      } else {
        alert("Form nháp đã được lưu thành công! (Chưa kích hoạt)");
      }
    }
  } catch (error) {
    console.error("Lỗi khi lưu form:", error);
    alert("Đã có lỗi xảy ra khi lưu form. Vui lòng thử lại.");
  }
};

  const activeQuestion = formSchema.find(q => q.field_id === activeId);


  const npsEmojis = ['😡', '😠', '😞', '🙁', '😐', '🙂', '😊', '😀', '😁', '😍'];

 
  return (
    <div className="flex h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col ">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-6">  
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="w-px h-6 bg-gray-300"></div> 
            <h1 className="font-extrabold text-lg text-gray-900 tracking-tight">Form Builder</h1>
          </div>

          <div className="flex items-center gap-3">
            {isLocked ? (
              <div className="px-5 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold flex items-center gap-2 cursor-not-allowed">
                <Lock size={16} /> Form Locked
                </div>
            ):(
              <>
             <button 
              onClick={() => handleSaveAction(false)} 
              className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Save Draft
            </button>
          <button 
              onClick={() => handleSaveAction(true)} 
              className="px-5 py-2 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-sm font-bold shadow-md transition-all"
            >
              Publish Survey
          </button>
          </>
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* CỘT 1: TOOLBOX */}
          <div className="w-72 bg-white border-r border-gray-100 p-6 overflow-y-auto shrink-0 z-10">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Question Types</h3>
            <div className="space-y-3">
              <div onClick={() => handleAddQuestion('NPS')}>
                <ToolItem icon={<Smile size={18} className="text-gray-400" />} title="Satisfaction Scale" desc="1 to 10 Emoji rating" />
              </div>
              <div onClick={() => handleAddQuestion('MULTIPLE_CHOICE')}>
                <ToolItem icon={<ListIcon size={18} className="text-gray-400" />} title="Multiple Choice" desc="Select options" />
              </div>
              <div onClick={() => handleAddQuestion('OPEN_COMMENT')}>
                <ToolItem icon={<MessageSquare size={18} className="text-gray-400" />} title="Open Comment" desc="Text area" />
              </div>
            </div>
          </div>

          {/* CỘT 2: CANVAS (Ở GIỮA) */}
          <div className="flex-1 p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
                <div className="h-40 bg-[#8c9db3] relative flex items-center justify-center">
                  <h2 className="relative text-white text-3xl font-extrabold tracking-tight drop-shadow-lg z-10">Event Feedback</h2>
                </div>

                <div className="p-10">
                  <div className="mb-10">
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full text-2xl font-extrabold text-gray-900 mb-2 border-none outline-none bg-transparent hover:bg-gray-50 focus:bg-gray-50 rounded p-1" />
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full text-gray-500 font-medium border-none outline-none bg-transparent hover:bg-gray-50 focus:bg-gray-50 rounded p-1 resize-none overflow-hidden" rows={2} />
                  </div>

                  {/* VÒNG LẶP RENDER CÂU HỎI */}
                  {formSchema.map((item) => {
                    const isActive = item.field_id === activeId;
                    return (
                      <div key={item.field_id} onClick={() => setActiveId(item.field_id)} className={`relative p-6 rounded-xl border-2 mb-6 group cursor-pointer transition-colors ${isActive ? 'border-[#8c9db3] bg-[#f8fbff] shadow-sm' : 'border-transparent border-gray-100 hover:border-gray-300'}`}>
                        {isActive && <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-[#8c9db3] rounded-r"></div>}
                        
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center text-lg">
                          {item.question} {item.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>

                        {/* RENDER: TỰ LUẬN */}
                        {item.type === 'OPEN_COMMENT' && (
                          <div className="w-full h-24 bg-white border border-gray-200 rounded-xl p-4 text-gray-400 text-sm shadow-inner">
                            Người dùng sẽ nhập câu trả lời dài ở đây...
                          </div>
                        )}

                        {/* RENDER: TRẮC NGHIỆM */}
                        {item.type === 'MULTIPLE_CHOICE' && (
                          <div className="space-y-3">
                            {item.options?.map((opt, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:border-[#8c9db3] transition-colors">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <span className="text-gray-700 font-medium text-sm">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* RENDER: NPS EMOJI SCALE (1-10) */}
                        {item.type === 'NPS' && (
                          <div className="mt-2">
                            <div className="flex justify-between w-full gap-2 mb-3">
                              {npsEmojis.map((emoji, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/emoji">
                                  <div className="text-3xl filter grayscale opacity-40 group-hover/emoji:grayscale-0 group-hover/emoji:opacity-100 transition-all duration-200 group-hover/emoji:scale-125 transform">
                                    {emoji}
                                  </div>
                                  <span className="text-xs font-bold text-gray-400 group-hover/emoji:text-[#8c9db3] mt-1">{idx + 1}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mt-4">
                              <span>{item.leftLabel || 'Rất tệ'}</span>
                              <span>{item.rightLabel || 'Tuyệt vời'}</span>
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

          {/* CỘT 3: FIELD PROPERTIES (BÊN PHẢI) */}
          <div className="w-[340px] bg-white border-l border-gray-100 p-6 overflow-y-auto shrink-0 z-10 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
            {activeQuestion ? (
              <>
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-extrabold text-gray-900 text-lg">Thuộc tính câu hỏi</h3>
                  <span className="bg-[#f8fbff] text-[#8c9db3] border border-[#8c9db3]/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {activeQuestion.type.replace('_', ' ')}
                  </span>
                </div>

                {/* LUÔN HIỆN TEXTAREA NHẬP CÂU HỎI */}
                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nội dung câu hỏi</label>
                  <textarea className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] resize-none h-24 shadow-sm"
                    value={activeQuestion.question} 
                    onChange={(e) => handleUpdateActiveQuestion('question', e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                  ></textarea>
                </div>

                {/* EDITOR CHO MULTIPLE CHOICE */}
                {activeQuestion.type === 'MULTIPLE_CHOICE' && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Các câu trả lời</label>
                    <div className="space-y-2 mb-4">
                      {activeQuestion.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 focus-within:border-[#8c9db3] focus-within:ring-1 focus-within:ring-[#8c9db3] shadow-sm">
                          <div className="w-4 h-4 rounded-full border border-gray-300 ml-2 shrink-0"></div>
                          <input type="text" value={opt} onChange={(e) => handleUpdateOption(i, e.target.value)} className="flex-1 p-2 text-sm outline-none font-medium text-gray-700 bg-transparent" placeholder={`Lựa chọn ${i + 1}`} />
                          <button onClick={() => handleRemoveOption(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                    {/* NÚT THÊM CÂU TRẢ LỜI */}
                    <button onClick={handleAddOption} className="w-full py-2.5 bg-white border border-gray-200 border-dashed rounded-lg text-sm font-bold text-[#8c9db3] flex items-center justify-center gap-2 hover:border-[#8c9db3] hover:bg-[#f8fbff] transition-all">
                      <PlusCircle size={18} /> Thêm lựa chọn
                    </button>
                  </div>
                )}

                {/* EDITOR CHO NPS */}
                {activeQuestion.type === 'NPS' && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nhãn trái (Mức 1)</label>
                      <input type="text" value={activeQuestion.leftLabel} onChange={(e) => handleUpdateActiveQuestion('leftLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nhãn phải (Mức 10)</label>
                      <input type="text" value={activeQuestion.rightLabel} onChange={(e) => handleUpdateActiveQuestion('rightLabel', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#8c9db3] shadow-sm" />
                    </div>
                  </div>
                )}

                {/* REQUIRED TOGGLE */}
                <div className="space-y-4 mb-8 py-4 mt-auto">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-sm font-bold text-gray-700">Bắt buộc trả lời</span>
                    <Toggle active={activeQuestion.required} onClick={() => handleUpdateActiveQuestion('required', !activeQuestion.required)} />
                  </div>
                </div>

                <button onClick={() => handleRemoveQuestion(activeId)} className="w-full py-3.5 rounded-xl border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-sm">
                  <Trash2 size={18} /> Xóa câu hỏi này
                </button>
              </>
            ) : (
              <div className="text-center text-gray-400 mt-20 text-sm font-medium">
                Vui lòng chọn một câu hỏi để chỉnh sửa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolItem = ({ icon, title, desc }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all`}>
    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-gray-800 leading-tight">{title}</h4>
      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{desc}</p>
    </div>
  </div>
);

const Toggle = ({ active, onClick }) => (
  <div onClick={onClick} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner ${active ? 'bg-[#8c9db3]' : 'bg-gray-300'}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${active ? 'left-6' : 'left-1'}`}></div>
  </div>
);

export default FeedbackBuilder;