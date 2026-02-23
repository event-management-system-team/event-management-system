import {
    CheckCircle2,
    ArrowRight,
    Users,
    ShieldCheck,
    Utensils
} from "lucide-react";
import RecruitmentCard from "../common/RecruitmentCard";
import { Link } from "react-router-dom";
import RecruitmentLeft from "./RecruitmentLeft";
import RecruitmentRight from "./RecruitmentRight";





// 2. MAIN COMPONENT
const RecruitmentSection = () => {
    return (
        <section className="py-24 px-6 bg-[#F1F0E8]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">

                {/* --- CỘT TRÁI: TEXT GIỚI THIỆU --- */}
                <RecruitmentLeft />

                {/* --- CỘT PHẢI: DANH SÁCH VIỆC LÀM --- */}
                <RecruitmentRight />

            </div>
        </section>
    );
};

export default RecruitmentSection;