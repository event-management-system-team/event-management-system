import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-2">

            {/* Login */}
            <button
                className="text-sm font-bold text-gray-600 px-4 py-2 hover:text-primary transition-colors cursor-pointer"
            // onClick={() => navigate("/login")}
            >
                Login
            </button>

            {/* Register */}
            <button
                className="bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-full hover:shadow-lg hover:bg-primary/90 transition-all transform cursor-pointer"
            // onClick={() => navigate("/register")}
            >
                Register
            </button>
        </div>
    );
};

export default AuthButtons;