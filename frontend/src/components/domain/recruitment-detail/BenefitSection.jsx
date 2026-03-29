import { ShieldCheck, Award, BookOpen, Coffee, Gift, Star, Briefcase, Heart, CheckCircle } from 'lucide-react';

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

// Auto-map icon dựa trên title nếu không có icon field
const guessIcon = (title) => {
    if (!title) return 'gift';
    const lower = title.toLowerCase();
    if (lower.includes('certificate') || lower.includes('award')) return 'award';
    if (lower.includes('lunch') || lower.includes('food') || lower.includes('meal') || lower.includes('coffee')) return 'coffee';
    if (lower.includes('stipend') || lower.includes('salary') || lower.includes('pay') || lower.includes('money')) return 'star';
    if (lower.includes('remote') || lower.includes('work') || lower.includes('job')) return 'briefcase';
    if (lower.includes('health') || lower.includes('insurance') || lower.includes('medical')) return 'heart';
    if (lower.includes('training') || lower.includes('learn') || lower.includes('course') || lower.includes('book')) return 'book';
    if (lower.includes('security') || lower.includes('safety') || lower.includes('protect')) return 'shield';
    return 'gift';
};

const renderBenefitIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || CheckCircle;
    return <IconComponent size={24} />;
};

const BenefitSection = ({ benefits }) => {
    if (!benefits || benefits.length === 0) return null;

    // Normalize: handle cả string lẫn object { icon, title }
    const normalizedBenefits = benefits.map((b) => {
        if (typeof b === 'string') {
            return { icon: guessIcon(b), title: b };
        }
        return {
            icon: b.icon || guessIcon(b.title),
            title: b.title || b,
        };
    });

    return (
        <section className="bg-[#FBFBFA] border-l-4 border-[#4ECDC4] rounded-xl p-8 shadow-sm">
            <h3 className="text-[15px] font-extrabold text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck size={24} className="text-[#4ECDC4]" />
                Exclusive Benefits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {normalizedBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4ECDC4] shadow-sm shrink-0">
                            {renderBenefitIcon(benefit.icon)}
                        </div>
                        <p className="font-bold text-slate-800 text-sm">{benefit.title}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BenefitSection;
