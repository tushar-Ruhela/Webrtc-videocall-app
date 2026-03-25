import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupPayload> = async (data) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Signup failed");

      setSuccessMsg("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(192,132,252,0.2) 0%, transparent 70%)",
          top: -150, right: -100,
          animationDuration: "10s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)",
          bottom: -80, left: -80,
          animationDuration: "12s",
        }}
      />

      {/* Card */}
      <div
        className="glass-card reveal"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2.5rem 2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6c63ff, #c084fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(108,99,255,0.45)",
              marginBottom: "1rem",
            }}
          >
            <FaVideo style={{ color: "#fff", fontSize: 22 }} />
          </div>
          <h1
            className="font-display gradient-text"
            style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.35rem" }}
          >
            Create account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Start video calling in seconds
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "#fca5a5",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "#86efac",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input-dark"
              placeholder="Your display name"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: "0.3rem" }}>{errors.username.message}</p>}
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="input-dark"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: "0.3rem" }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-dark"
              placeholder="At least 8 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                maxLength: { value: 20, message: "Max 20 characters" },
              })}
            />
            {errors.password && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: "0.3rem" }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-glow"
            style={{
              padding: "0.85rem",
              borderRadius: 10,
              fontSize: "0.95rem",
              marginTop: "0.25rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-bright)", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
