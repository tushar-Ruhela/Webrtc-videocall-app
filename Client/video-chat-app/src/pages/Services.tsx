import Navbar from "../components/Navbar";

const servicesList = [
  {
    title: "High-Quality Video Calls",
    description: "Enjoy crystal-clear video calls with minimal latency and smooth streaming.",
  },
  {
    title: "Screen Sharing",
    description: "Share your screen in real-time for presentations, tutorials, and collaborations.",
  },
  {
    title: "Multi-Participant Rooms",
    description: "Host meetings with multiple participants easily without any limit hassles.",
  },
  {
    title: "Secure & Encrypted",
    description: "All your calls are protected with WebRTC's built-in advanced DTLS-SRTP encryption.",
  },
];

const Services = () => {
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
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <section
        style={{
          flex: 1,
          padding: "8rem 1.5rem 4rem",
          maxWidth: 1100,
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
          Our Services
        </h1>
        <p
          className="reveal reveal-d2"
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.1rem",
            maxWidth: 600,
            margin: "0 auto 4rem",
            lineHeight: 1.6,
          }}
        >
          Discover the powerful features we offer to make your video calling experience seamless and professional.
        </p>

        <div
          className="reveal reveal-d3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = "translateY(-4px)";
                target.style.borderColor = "var(--border-accent)";
                target.style.boxShadow = "0 0 30px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = "translateY(0)";
                target.style.borderColor = "var(--border)";
                target.style.boxShadow = "none";
              }}
            >
              <h2
                className="font-display gradient-text-accent"
                style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}
              >
                {service.title}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {service.description}
              </p>
            </div>
          ))}
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

export default Services;
