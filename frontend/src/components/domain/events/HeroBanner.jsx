import HeroSearchBar from './HeroSearchBar'
import { useTranslation } from "react-i18next";

const HeroBanner = ({ keyword, setKeyword, location, setLocation, handleSearch, handleKeyDown }) => {
    const { t } = useTranslation();
    return (
        <section className="relative pt-12 pb-24 px-6 bg-gradient-to-b from-cream to-beige">
            <div className="max-w-[960px] mx-auto text-center">
                <h1 className="font-sans text-4xl md:text-5xl font-black mb-4">{t("explore_featured_events")}</h1>
                <p className="font-sans text-gray-600 mb-10 max-w-xl mx-auto">{t("discover_sophisticated_experiences")}</p>
            </div>

            <div className="z-20 mx-auto max-w-5xl px-4">
                <HeroSearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    location={location}
                    setLocation={setLocation}
                    handleSearch={handleSearch}
                    handleKeyDown={handleKeyDown} />
            </div>
        </section>
    )
}

export default HeroBanner
