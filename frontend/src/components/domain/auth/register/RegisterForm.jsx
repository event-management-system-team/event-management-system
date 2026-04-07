import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterSchema } from "../../../../schemas/register.schema";
import {
  registerUser,
  clearError,
  clearRegisterSuccess,
} from "../../../../store/slices/auth.slice";
import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { MdArrowForward } from "react-icons/md";
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";
import LogoImg from "../../../../assets/logo.png";
import { useTranslation } from "react-i18next";

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading, error, registerSuccess, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    special: false,
    uppercase: false,
    number: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(createRegisterSchema(t)),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password", "");

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearRegisterSuccess());
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const { agreeToTerms: _agreeToTerms, ...registerData } = data;
    await dispatch(registerUser(registerData));
  };

  const handlePasswordChange = async () => {
    const confirmPassword = watch("confirmPassword");
    if (confirmPassword) {
      await trigger("confirmPassword");
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-[#F1F0E8] flex flex-col items-center justify-center px-6 py-12 md:px-20 lg:px-32">
      <div className="w-full max-w-md">
        <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
          <img src={LogoImg} alt="EventHub Logo" className="w-12 h-12 object-contain" />
          <span className="text-xl font-bold text-gray-900">EventHub</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("create_account_title")}
          </h2>
          <p className="text-gray-500">
            {t("create_account_subtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-red-800 text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            id="fullName"
            label={t("full_name")}
            placeholder="Nguyen Van A"
            type="text"
            error={errors.fullName}
            {...register("fullName")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="email"
              label={t("email_label")}
              placeholder="example@email.com"
              type="email"
              error={errors.email}
              {...register("email")}
            />
            <InputField
              id="phone"
              label={t("phone_number")}
              placeholder="+1234567890"
              type="tel"
              error={errors.phone}
              {...register("phone")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="password"
              label={t("password")}
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register("password", {
                onChange: handlePasswordChange,
              })}
            />
            <InputField
              id="confirmPassword"
              label={t("confirm_password")}
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.length ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              {t("pwd_at_least_8")}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.special ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              {t("pwd_special_char")}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.uppercase ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              {t("pwd_uppercase")}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.number ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              {t("pwd_number")}
            </div>
          </div>

          <div className="py-2">
            <label className="flex items-start cursor-pointer group">
              <input
                className="mt-1 size-5 rounded-md border-gray-300 text-[#8aa8b2] focus:ring-primary"
                type="checkbox"
                {...register("agreeToTerms")}
              />
              <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                {t("agree_to")}{" "}
                <a className="text-[#8aa8b2] hover:underline" href="#">
                  {t("terms_of_use")}
                </a>{" "}
                {t("and")}{" "}
                <a className="text-[#8aa8b2] hover:underline" href="#">
                  {t("privacy_policy")}
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 ml-8">
                <span>⚠️</span>
                <span>{errors.agreeToTerms.message}</span>
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            <span>{loading ? t("creating_account") : t("create_account")}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          {t("already_have_account")}
          <Link
            to="/login"
            className="text-[#8aa8b2] font-bold hover:underline ml-1"
          >
            {t("login_now_link")}
          </Link>
        </p>
      </div>
    </div>
  );
};
