import RecruitmentLeft from "./RecruitmentLeft";
import RecruitmentRight from "./RecruitmentRight";

const RecruitmentSection = () => {
    return (
        <section className="py-24 px-6 bg-[#F1F0E8]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">

                <RecruitmentLeft />

                <RecruitmentRight />

            </div>
        </section>
    );
};

export default RecruitmentSection;