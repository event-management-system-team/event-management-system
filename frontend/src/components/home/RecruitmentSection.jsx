import {
    CheckCircle2,
    ArrowRight,
    Users,
    ShieldCheck,
    Utensils
} from "lucide-react";
import RecruitmentCard from "../common/RecruitmentCard";

const JOBS = [
    {
        title: "Lead Event Coordinator",
        eventName: "Music Fest",
        type: "Full-time",
        time: "July-Aug",
        salary: "$28",
        benefit: "Plus Benefits",
        icon: Users
    },
    {
        title: "Safety & Security Officer",
        eventName: "Tech Expo",
        type: "Seasonal",
        time: "Sept",
        salary: "$22",
        benefit: "Cert Provided",
        icon: ShieldCheck
    },
    {
        title: "VIP Hospitality Host",
        eventName: "Food Trail",
        type: "Weekend",
        time: "Oct",
        salary: "$25",
        benefit: "Daily Stipend",
        icon: Utensils
    }
];

const BENEFITS = [
    "Competitive hourly rates & performance bonuses",
    "Official certification for every event",
    "Flexible shifts managed via mobile app",
];

// 2. MAIN COMPONENT
const RecruitmentSection = () => {
    return (
        <section className="py-24 px-6 bg-[#F1F0E8]"> {/* Nền màu kem nhạt */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">

                {/* --- CỘT TRÁI: TEXT GIỚI THIỆU --- */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Badge */}
                    <div className="inline-block bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Work with us
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-gray-900">
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

                    <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-primary hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2 group">
                        Explore Opportunities
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* --- CỘT PHẢI: DANH SÁCH VIỆC LÀM --- */}
                <div className="lg:col-span-7 grid gap-5">
                    {JOBS.map((job, index) => (
                        <RecruitmentCard key={index} {...job} />
                    ))}

                    {/* Một dòng nhỏ khuyến khích bên dưới */}
                    <p className="text-center text-sm text-gray-500 mt-2 font-medium">
                        Thinking about joining? <a href="#" className="text-primary hover:underline">View 150+ open positions</a>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default RecruitmentSection;