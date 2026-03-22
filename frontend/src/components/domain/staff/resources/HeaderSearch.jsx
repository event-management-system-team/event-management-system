import { Search } from 'lucide-react'

const HeaderSearch = ({ searchQuery, setSearchQuery, eventName }) => {

    return (
        <>
            <div className="flex flex-col gap-2 mb-8 pl-2">
                <h2 className="text-[#2C3E50] text-4xl font-extrabold leading-tight tracking-tight">Resources Event</h2>
                <p className="text-[#89A8B2] text-lg font-medium italic">{eventName}</p>
            </div>

            <div className="mb-8">
                <div className="flex w-full items-stretch rounded-2xl h-14 bg-white border border-slate-200 focus-within:border-[#89A8B2] focus-within:ring-4 focus-within:ring-[#89A8B2]/20 transition-all shadow-sm">
                    <div className="text-[#89A8B2] flex items-center justify-center pl-5">
                        <Search size={20} />
                    </div>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 px-4 text-base font-medium placeholder:text-slate-400 text-[#2C3E50]"
                        placeholder="Search document, material,..."
                    />
                </div>
            </div>
        </>
    )
}

export default HeaderSearch
