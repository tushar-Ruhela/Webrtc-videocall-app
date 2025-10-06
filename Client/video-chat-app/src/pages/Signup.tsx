import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { FaVideo } from "react-icons/fa";

interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupPayload>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignupPayload> = async (data) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Signup failed");

      setSuccessMsg("Signup successful! You can now log in.");
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100 overflow-y-auto">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex flex-col justify-center items-center flex-1 px-4 sm:px-6 lg:px-8 mt-24 mb-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10 transition-transform hover:scale-[1.01] duration-200">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <FaVideo className="text-blue-600" size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Create Your Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Join us and start video calling instantly.
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <p className="text-red-600 text-center text-sm mb-3 bg-red-100 p-2 rounded-md">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-green-600 text-center text-sm mb-3 bg-green-100 p-2 rounded-md">
              {successMsg}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username", { required: "Username is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  maxLength: { value: 20, message: "Max 20 characters" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition text-sm sm:text-base ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-400 text-xs sm:text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-xs sm:text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs sm:text-sm text-gray-500">
        © {new Date().getFullYear()} VideoCallApp · All rights reserved
      </footer>
    </div>
  );
};

export default Signup;
