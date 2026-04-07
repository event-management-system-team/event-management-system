import {
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecruitmentLeft = () => {

    const { t } = useTranslation();

    const BENEFITS = [
        t("benefit_1"),
        t("benefit_2"),
        t("benefit_3"),
    ];

    return (
        <div className="lg:col-span-5 space-y-8">
            {/* Badge */}
            <div className="inline-block bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {t("work_with_us")}
            </div>

            <h2 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight " dangerouslySetInnerHTML={{ __html: t("recruitment_title") }} />

            <p className="text-lg text-gray-600 leading-relaxed">
                {t("recruitment_desc")}
            </p>

            {/* List Benefits */}
            <ul className="space-y-4">
                {BENEFITS.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="text-teal-600 shrink-0" size={24} />
                        <span className="font-bold text-gray-700">{item}</span>
                    </li>
                ))}
            </ul>

            <Link to={'/recruitments'}>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-primary hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2 group">
                    {t("explore_opportunities")}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>

        </div>
    )
}

export default RecruitmentLeft
