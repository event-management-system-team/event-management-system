import HeroSearchBar from './HeroSearchBar'

const HeroBanner = ({ keyword, setKeyword, handleSearch, handleKeyDown }) => {
    return (
        <section className="relative pt-12 pb-24 px-6 bg-gradient-to-b from-cream to-beige">
            <div className="max-w-[960px] mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4">Join the Team</h1>
                <p className="text-gray-600 mb-10 max-w-xl mx-auto">Find professional opportunities in the most exciting events around the city.</p>
            </div>

            <div className="z-20 mx-auto max-w-5xl px-4">
                <HeroSearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    handleSearch={handleSearch}
                    handleKeyDown={handleKeyDown} />
            </div>
        </section>
    )
}

export default HeroBanner
