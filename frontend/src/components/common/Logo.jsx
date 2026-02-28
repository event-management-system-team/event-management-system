import LogoImg from '../../assets/logo.png'

const Logo = () => {

    return (
        <>
            <div className="flex items-center gap-2">
                <img
                    src={LogoImg}
                    alt="EventHub Logo"
                    className="w-10 h-10 object-contain" />

                <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gray-800 to-primary bg-clip-text text-transparent">
                    EventHub
                </h2>
            </div>
        </>

    )
}

export default Logo


