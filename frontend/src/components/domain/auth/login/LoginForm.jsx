import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { SiEventbrite } from "react-icons/si";
import { MdArrowForward } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { loginSchema } from "../../../../schemas/login.schema";
import { useEffect } from "react";
import {
  loginUser,
  loginWithGoogle,
  clearError,
} from "../../../../store/slices/auth.slice";

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
      navigate("/me");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    await dispatch(loginUser(data));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google credential:", credentialResponse);
    try {
      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
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

        <div className="flex justify-center mb-8 text-center text-gray-700">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            type="standard"
            theme="outline"
            size="large"
            text="continue_with"
            shape="pill"
            width="384"
            locale="en"
          />
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
              >
                Forgot password?
              </Link>
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
            <Link to="/register">Sign up now</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
