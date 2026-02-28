import { ShieldCheck, Award, BookOpen, Coffee, Gift, Star, Briefcase, Heart, CheckCircle } from 'lucide-react';

const renderBenefitIcon = (iconName) => {
    const iconMap = {
        award: Award,
        book: BookOpen,
        coffee: Coffee,
        gift: Gift,
        star: Star,
        shield: ShieldCheck,
        briefcase: Briefcase,
        heart: Heart,
    };

    const IconComponent = iconMap[iconName] || CheckCircle;
    return <IconComponent size={24} />;
};

const BenefitSection = ({ benefits }) => {
    return (
        <div>
            {benefits && benefits.length > 0 && (
                <section className="bg-[#FBFBFA] border-l-4 border-[#4ECDC4] rounded-xl p-8 shadow-sm">

                    <h3 className="text-[15px] font-extrabold text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-wider">
                        <ShieldCheck size={24} className="text-[#4ECDC4]" />
                        Exclusive Benefits
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#4ECDC4] shadow-sm shrink-0">
                                    {renderBenefitIcon(benefit.icon)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{benefit.title}</p>
                                    <p className="text-slate-500 text-[13px] mt-1.5 leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>
            )}
        </div>
    )
}

export default BenefitSection
