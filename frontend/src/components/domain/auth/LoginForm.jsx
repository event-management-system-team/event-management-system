import { InputField } from "../../common/InputField";
import { Button } from "../../common/Button";
import { SiEventbrite } from "react-icons/si";
import { MdArrowForward } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

export const LoginForm = () => {
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

        <form className="space-y-6">
          <InputField
            id="email"
            label="Email or Phone Number"
            placeholder="example@email.com"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
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
            <a
              className="text-sm font-bold text-[#FF6B35] hover:opacity-80 transition-opacity"
              href="#"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit">
            <span>Login Now</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </form>

        <p className="mt-10 text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
          Don't have an account?
          <a className="text-[#8aa8b2] font-bold hover:underline ml-1" href="#">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};
