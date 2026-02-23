import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../../schemas/register.schema";
import {
  registerUser,
  clearError,
  clearRegisterSuccess,
} from "../../../../store/slices/auth.slice";
import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { SiEventbrite } from "react-icons/si";
import { MdArrowForward } from "react-icons/md";
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    resolver: zodResolver(registerSchema),
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
          <SiEventbrite className="size-12 text-primary" />
          <span className="text-xl font-bold text-gray-900">EventHub</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create a new account 🎉
          </h2>
          <p className="text-gray-500">
            It only takes 2 minutes to get started
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
            label="Full Name"
            placeholder="Your full name"
            type="text"
            error={errors.fullName}
            {...register("fullName")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="email"
              label="Email"
              placeholder="example@email.com"
              type="email"
              error={errors.email}
              {...register("email")}
            />
            <InputField
              id="phone"
              label="Phone Number"
              placeholder="+1234567890"
              type="tel"
              error={errors.phone}
              {...register("phone")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register("password", {
                onChange: handlePasswordChange,
              })}
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password"
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
              At least 8 characters
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.special ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              One special character
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.uppercase ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              One uppercase letter
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.number ? (
                <FaRegCheckCircle className="text-green-500 text-sm" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm" />
              )}
              One number
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
                I agree to the{" "}
                <a className="text-[#8aa8b2] hover:underline" href="#">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a className="text-[#8aa8b2] hover:underline" href="#">
                  Privacy Policy
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
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          Already have an account?
          <Link
            to="/login"
            className="text-[#8aa8b2] font-bold hover:underline ml-1"
          >
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};
