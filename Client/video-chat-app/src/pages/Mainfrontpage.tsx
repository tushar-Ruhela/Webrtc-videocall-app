import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaVideo,
  FaLock,
  FaComments,
  FaUsers,
  FaDesktop,
  FaShieldAlt,
} from "react-icons/fa";

const FEATURES = [
  {
    icon: <FaVideo />,
    title: "HD Video Calls",
    desc: "Crystal-clear 1080p video with adaptive bitrate for any connection speed.",
  },
  {
    icon: <FaComments />,
    title: "Real-time Chat",
    desc: "Send messages, links, and reactions across all participants instantly.",
  },
  {
    icon: <FaLock />,
    title: "End-to-End Encrypted",
    desc: "Your calls are protected by WebRTC's built-in DTLS-SRTP encryption.",
  },
  {
    icon: <FaUsers />,
    title: "Multi-User Rooms",
    desc: "Host group meetings with easy-to-share room codes — no downloads needed.",
  },
  {
    icon: <FaDesktop />,
    title: "Screen Sharing",
    desc: "Share your entire screen or a single window with one click, live.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Auth Protected",
    desc: "Secure login ensures only invited participants join your meetings.",
  },
];

const STATS = [
  { value: "10K+", label: "Meetings hosted" },
  { value: "99.9%", label: "Uptime reliability" },
  { value: "<80ms", label: "Avg. latency" },
  { value: "256-bit", label: "Encryption" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create an account", desc: "Sign up in seconds with just your email and a password." },
  { step: "02", title: "Start or join a room", desc: "Enter any room code to instantly join a secure meeting space." },
  { step: "03", title: "Connect seamlessly", desc: "Video, audio, screen share, and chat all in one place — zero friction." },
];

const Mainfrontpage = () => {
  return (
    <div className="noise" style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", overflowX: "hidden" }}>
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 800 }}>
          {/* Badge */}
          <div
            className="reveal reveal-d1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(108,99,255,0.12)",
              border: "1px solid var(--border-accent)",
              borderRadius: 999,
              padding: "0.35rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--accent-bright)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-bright)", display: "inline-block", boxShadow: "0 0 8px var(--accent-bright)" }} />
            WebRTC Powered · Zero plugins
          </div>

          <h1
            className="reveal reveal-d2 font-display gradient-text"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Meetings that<br />
            <span className="gradient-text-accent">just work.</span>
          </h1>

          <p
            className="reveal reveal-d3"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "var(--text-secondary)",
              maxWidth: 540,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            HD video calls, real-time chat, and screen sharing — all encrypted,
            all browser-native, no downloads required.
          </p>

          <div
            className="reveal reveal-d4"
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}
          >
            <Link
              to="/signup"
              className="btn-glow"
              style={{ padding: "0.85rem 2rem", borderRadius: 10, textDecoration: "none", fontSize: "1rem" }}
            >
              Start for free →
            </Link>
            <Link
              to="/login"
              className="btn-ghost"
              style={{ padding: "0.85rem 2rem", borderRadius: 10, textDecoration: "none", fontSize: "1rem" }}
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p
            className="reveal reveal-d5"
            style={{ marginTop: "2rem", fontSize: "0.8rem", color: "var(--text-muted)" }}
          >
            No credit card needed · Free to use · Open source
          </p>
        </div>

        {/* Decorative bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(transparent, var(--bg-base))",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "3rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <div
                className="font-display gradient-text-accent"
                style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.4rem" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "5rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ color: "var(--accent-bright)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Everything you need
          </p>
          <h2
            className="font-display gradient-text"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Built for real conversations
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(108,99,255,0.15)",
                  border: "1px solid var(--border-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.15rem",
                  color: "var(--accent-bright)",
                  marginBottom: "1.2rem",
                }}
              >
                {f.icon}
              </div>
              <h3
                className="font-display"
                style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}
              >
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              className="font-display gradient-text"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Up in 30 seconds
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
                <div
                  className="font-display gradient-text-accent"
                  style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1, opacity: 0.6 }}
                >
                  {item.step}
                </div>
                <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{ display: "none" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", position: "absolute" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2
            className="font-display gradient-text"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}
          >
            Ready to connect?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "2rem" }}>
            Create a free account and start your first video meeting in seconds.
          </p>
          <Link
            to="/signup"
            className="btn-glow"
            style={{ padding: "1rem 2.5rem", borderRadius: 12, textDecoration: "none", fontSize: "1.05rem" }}
          >
            Get started — it's free
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6c63ff,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaVideo style={{ color: "#fff", fontSize: 12 }} />
            </div>
            <span className="font-display" style={{ fontWeight: 700, fontSize: "0.95rem" }}>VideoMeet</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} VideoMeet — All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Mainfrontpage;
