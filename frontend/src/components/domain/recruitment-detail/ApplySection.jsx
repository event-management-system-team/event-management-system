import { Progress } from 'antd'
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react'
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";

const ApplySection = ({ eventSlug, active, location, daysLeft, filledPercentage, formattedDeadline, totalAvailable, totalVacancy, deadlineDate, startDate, endDate }) => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-2xl p-7 shadow-xl shadow-slate-200/50 border border-[#E5E1DA]/50">
            <div className="flex justify-between items-center mb-8">
                <span className="bg-[#4ECDC4]/10 text-[#4ECDC4] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {active ? 'OPEN' : 'CLOSED'}
                </span>
                <span className="text-slate-400 text-xs font-medium">
                    {daysLeft > 0 ? daysLeft : 0} {t("days_left")}
                </span>
            </div>

            <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                    <Calendar size={18} className="text-primary mt-0.5" />
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">{t("deadline")}</p>

                        {deadlineDate ? (
                            <p className="text-[14px] font-bold text-slate-900">{formattedDeadline}</p>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4] text-[11px] font-bold uppercase tracking-wide border border-[#4ECDC4]/20">
                                {t("open_until_filled")}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <Clock size={18} className="text-primary mt-0.5" />
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">{t("event_duration")}</p>
                        <p className="text-[14px] font-bold text-slate-600 leading-relaxed">
                            {startDate ? new Date(startDate).toLocaleDateString('en-GB') : 'TBA'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">{t("location")}</p>
                        <p className="text-[14px] font-bold text-slate-600 leading-relaxed">{location}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-wide">
                    <span className="text-slate-500">{t("available_slots")}</span>
                    <span className="text-teal-accent">{totalAvailable} / {totalVacancy}</span>
                </div>

                <Progress
                    percent={filledPercentage}
                    showInfo={false}
                    strokeColor="var(--color-teal-accent)"
                    railColor="#f1f5f9"
                    size={[400, 13]}
                    className="m-0 leading-none"
                />
            </div>



            <button
                disabled={totalAvailable <= 0 || !active}
                className="w-full py-4 text-[15px] font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group uppercase
               bg-primary text-white shadow-lg shadow-primary/30 
               hover:bg-primary/90 hover:shadow-primary/50 hover:-translate-y-1
               disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-slate-200"
                onClick={() => navigate(`/attendee/recruitments/${eventSlug}/apply-staff`)}
            >
                {status === 'CLOSED' ? t("closed") : (totalAvailable <= 0 ? t("fully_booked") : t("apply_now"))}

                {!(totalAvailable <= 0 || !active) && (
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                )}
            </button>

        </div >
    )
}

export default ApplySection
