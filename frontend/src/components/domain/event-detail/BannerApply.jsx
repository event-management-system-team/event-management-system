import { Briefcase } from 'lucide-react'
import React from 'react'

const BannerApply = () => {
    return (
        <div className="border-2 border-teal-accent bg-brand-teal/5 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
                <div className="size-12 bg-teal-accent rounded-full flex items-center justify-center text-white shrink-0">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-xl font-bold">Join the Event Team</h4>
                    <p className="text-sm text-slate-600  mt-1">We are looking for backstage crew, security, and guest relations staff.</p>
                </div>
            </div>
            <button className="bg-teal-accent hover:bg-teal-accent/90 text-white font-bold px-8 py-3 rounded-full transition-all shrink-0">
                Apply Now
            </button>
        </div>
    )
}

export default BannerApply
