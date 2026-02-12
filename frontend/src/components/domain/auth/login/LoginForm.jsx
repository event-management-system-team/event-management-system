import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { SiEventbrite } from "react-icons/si";
import { MdArrowForward } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { loginSchema } from "../../../../schemas/login.schema";
import { useEffect } from "react";
import { loginUser, clearError } from "../../../../store/slices/auth.slice";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAuthenticated) {
      //navigate("/");
      console.log("isAuthenticated");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    await dispatch(loginUser(data));
  };

  return (
    <div className="w-full md:w-1/2 bg-[#F1F0E8] flex flex-col items-center justify-center px-6 py-12 md:px-20 lg:px-32">
      <div className="w-full max-w-md">
        <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
          <SiEventbrite className="size-12 text-primary" />
          <span className="text-xl font-bold text-gray-900 ">EventHub</span>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-500 ">
            Please log in to continue your journey.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-red-800 text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button className="w-full flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            <FcGoogle className="size-5" />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center mb-8">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-400 text-sm font-medium">
            Or continue with
          </span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="email"
            label="Email or Phone Number"
            placeholder="example@email.com"
            error={errors.email}
            {...register("email")}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password")}
          />

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center cursor-pointer group">
              <input
                className="size-5 rounded-md border-gray-300 text-[#8aa8b2] focus:ring-primary"
                type="checkbox"
              />
              <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>
            <div className="text-sm font-bold text-[#FF6B35] hover:opacity-80 transition-opacity">
              <Link
              //to="/forgot-password"
              />
              Forgot password?
            </div>
          </div>

          <Button type="submit">
            <span>{loading ? "Logging in..." : "Login Now"}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </form>

        <p className="mt-10 text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
          Don't have an account?
          <span className="text-[#8aa8b2] font-bold hover:underline ml-1">
            <Link to="/register" />
            Sign up now
          </span>
        </p>
      </div>
    </div>
  );
};
