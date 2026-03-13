import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthButtons = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {/* Login */}
      <button
        className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors cursor-pointer"
        onClick={() => navigate("/login")}
      >
        {t("login")}
      </button>

      {/* Register */}
      <button
        className="bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-full hover:shadow-lg hover:bg-primary/90 transition-all transform cursor-pointer"
        onClick={() => navigate("/register")}
      >
        {t("register")}
      </button>
    </div>
  );
};

export default AuthButtons;
