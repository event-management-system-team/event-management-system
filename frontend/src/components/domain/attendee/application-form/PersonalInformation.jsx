import { Lock } from "lucide-react"
import { useTranslation } from 'react-i18next';

const PersonalInformation = ({ userProfile }) => {
    const { t } = useTranslation();
    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold border-l-4 border-[#89A8B2] pl-4">{t('app_personal_info')}</h2>
                <span className="text-xs text-[#6a777c] flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full font-medium w-fit">
                    <Lock size={12} /> {t('app_auto_filled')}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">{t('app_full_name')}</label>
                    <input type="text" value={userProfile.fullName} readOnly className="rounded-[16px] border-transparent bg-slate-100 h-12 px-4 text-slate-700 font-medium cursor-not-allowed focus:outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">{t('app_email')}</label>
                    <input type="email" value={userProfile.email} readOnly className="rounded-[16px] border-transparent bg-slate-100 h-12 px-4 text-slate-700 font-medium cursor-not-allowed focus:outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">{t('app_phone')}</label>
                    <input type="text" value={userProfile.phone} readOnly className="rounded-[16px] border-transparent bg-slate-100 h-12 px-4 text-slate-700 font-medium cursor-not-allowed focus:outline-none" />
                </div>
            </div>
            <p className="text-xs text-[#6a777c] mt-3 ml-2">
                {t('app_need_update')} <a href="/attendee/me" className="text-[#89A8B2] hover:underline font-bold transition-colors">{t('app_edit_profile')}</a>
            </p>
        </section>
    )
}

export default PersonalInformation
