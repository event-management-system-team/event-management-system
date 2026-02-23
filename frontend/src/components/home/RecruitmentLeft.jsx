import {
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const RecruitmentLeft = () => {

    const BENEFITS = [
        "Competitive hourly rates & performance bonuses",
        "Official certification for every event",
        "Flexible shifts managed via mobile app",
    ];

    return (
        <div className="lg:col-span-5 space-y-8">
            {/* Badge */}
            <div className="inline-block bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Work with us
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ">
                Work at the Hottest <br /> Events in Town
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
                Join our community of 5000+ professionals. Gain experience, get certified, and earn competitive pay while enjoying the front row of the biggest events.
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
                    Explore Opportunities
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>

        </div>
    )
}

export default RecruitmentLeft
