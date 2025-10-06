import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { FaVideo } from "react-icons/fa";

interface LoginPayload {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Invalid credentials");
      }

      // ✅ Store tokens and user info
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);
    localStorage.setItem(
  "user",
  JSON.stringify({ name: result.user.username, email: result.user.email })
);


      window.location.href = "/home";
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100 overflow-y-auto">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 items-center justify-center px-4 mt-24 mb-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 transition-transform transform hover:scale-[1.01]">
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaVideo className="text-blue-600" size={40} />
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 mt-3">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm mt-1 text-center">
              Log in to join your meetings and connect instantly.
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="text-red-600 text-center text-sm mb-3 bg-red-100 p-2 rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-2">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-400 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Sign Up */}
            <p className="text-center text-gray-600 text-sm">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} VideoCallApp · All rights reserved
      </footer>
    </div>
  );
};

export default Login;
