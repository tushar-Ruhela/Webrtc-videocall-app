import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {/* Background orbs */}
      <div className="orb orb-3" style={{ top: "-100px", left: "-100px", width: 400, height: 400 }} />
      <div className="orb" style={{ bottom: "-100px", right: "-100px", width: 500, height: 500, background: "radial-gradient(circle, rgba(192,132,252,0.15) 0%, transparent 70%)" }} />

      <section
        style={{
          flex: 1,
          padding: "8rem 1.5rem 4rem",
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
        className="text-center"
      >
        <h1
          className="font-display gradient-text reveal reveal-d1"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
          }}
        >
          About VideoMeet
        </h1>
        <p
          className="reveal reveal-d2"
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.1rem",
            maxWidth: 600,
            margin: "0 auto 3rem",
            lineHeight: 1.6,
          }}
        >
          VideoMeet is a modern, high-performance video communication platform designed to bring people together instantly, securely, and without boundaries.
        </p>

        <div
          className="glass-card reveal reveal-d3"
          style={{
            padding: "3rem",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          <div>
            <h3 className="font-display gradient-text-accent" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Our Mission
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              We believe communication should be completely frictionless. No complex software downloads, no arbitrary time limits, and absolutely no compromise on privacy and security. VideoMeet was built natively on WebRTC to provide a pure, browser-based experience that connects you to anyone, anywhere, in seconds.
            </p>
          </div>
          <div>
            <h3 className="font-display gradient-text-accent" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              The Technology
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Leveraging advanced WebRTC infrastructure paired with globally distributed TURN relays, we ensure crystal clear, low-latency streams regardless of restrictive firewalls or varying network conditions. Every single byte is end-to-end encrypted (DTLS-SRTP), giving you complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      <footer
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        © {new Date().getFullYear()} VideoMeet — All Rights Reserved.
      </footer>
    </div>
  );
};

export default About;
