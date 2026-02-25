import { CalendarDays } from 'lucide-react'
import React from 'react'

const FilterDate = () => {
    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="text-primary w-5 h-5" strokeWidth={2.5} />
                    <span className="font-bold text-sm">Date</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <button className="py-2 px-3 text-left rounded-lg text-sm font-medium bg-white hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">Today</button>
                    <button className="py-2 px-3 text-left rounded-lg text-sm font-medium bg-white hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">This Weekend</button>
                    <button className="py-2 px-3 text-left rounded-lg text-sm font-medium bg-primary/20 text-primary ring-1 ring-primary/30 cursor-pointer">Next Month</button>
                </div>
            </div>
        </div>
    )
}

export default FilterDate
