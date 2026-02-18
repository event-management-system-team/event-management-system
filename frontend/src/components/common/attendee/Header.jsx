import Logo from '../Logo'
import NavMenu from "./NavMenu";
import SearchBar from "../SearchBar";
import AuthButtons from '../AuthButton';
import UserDropdown from './UserDropdown';

const HeaderApp = () => {

    const isLoggedIn = true;
    return (
        <>
            <header className="sticky top-0 z-50 border-b border-[#d8ddde] bg-[#F1F0E8]">
                <div className="w-full mx-auto px-6 h-20 flex items-center justify-between">
                    <Logo />
                    <NavMenu />

                    <div className="flex items-center gap-6">
                        <SearchBar />

                        {isLoggedIn ?
                            (<UserDropdown />)
                            :
                            (<AuthButtons />)
                        }

                    </div>
                </div>
            </header>
        </>

    )
}

export default HeaderApp


