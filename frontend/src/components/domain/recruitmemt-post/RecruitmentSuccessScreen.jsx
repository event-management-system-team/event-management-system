import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Briefcase } from "lucide-react";
import dayjs from "dayjs";

const RecruitmentSuccessScreen = ({ form }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-lg w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#4a9e9e]/15 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 size={36} className="text-[#4a9e9e]" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Recruitment Posted!
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Your recruitment post has been published and is now visible to
          candidates.
        </p>

        {/* Summary card */}
        <div className="w-full bg-[#f9f9f7] rounded-xl border border-gray-100 p-4 flex items-center gap-3 mb-6 text-left">
          <div className="w-12 h-12 rounded-full bg-[#4a9e9e]/20 flex items-center justify-center shrink-0">
            <Briefcase size={20} className="text-[#4a9e9e]" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {form.positionName || "New Position"}
            </p>
            <p className="text-xs text-[#4a9e9e] mt-0.5">
              {form.vacancy}{" "}
              {parseInt(form.vacancy) === 1 ? "vacancy" : "vacancies"}
            </p>
            {form.deadline && (
              <p className="text-xs text-gray-400 mt-0.5">
                Deadline: {dayjs(form.deadline).format("DD/MM/YYYY")}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(`/organizer/recruitmentlist/${form.eventId}`)}
          className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-7 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Recruitments
        </button>
      </div>
    </div>
  );
};

export default RecruitmentSuccessScreen;
