import { useNavigate } from 'react-router-dom';
import { MoveLeft, XCircle } from 'lucide-react';

const ClosedRecruitmentRedirect = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F1F0E8] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center flex flex-col items-center border border-slate-100">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle strokeWidth={2.5} className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Recruitment Closed</h2>

                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                    We're sorry, but the application period for this position has already ended. Thank you for your interest!
                </p>

                <button
                    onClick={() => navigate('/recruitments')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-md"
                >
                    <MoveLeft strokeWidth={2.5} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ClosedRecruitmentRedirect;
