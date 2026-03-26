import Navbar from "../components/Navbar";

const pricingPlans = [
  {
    name: "Basic",
    price: "$0 / mo",
    features: [
      "1:1 Video Calls",
      "Limited Participants",
      "Standard Quality",
    ],
  },
  {
    name: "Pro",
    price: "$15 / mo",
    features: [
      "Group Video Calls",
      "High-Quality Streaming",
      "Screen Sharing",
      "Custom Room Names",
    ],
  },
  {
    name: "Enterprise",
    price: "$50 / mo",
    features: [
      "Unlimited Participants",
      "Full HD Video & Audio",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
];

const Pricing = () => {
  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
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
          Simple, transparent pricing
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
          Choose the best plan for you and your team. Upgrade anytime as you grow.
        </p>

        <div
          className="reveal reveal-d3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = "translateY(-5px)";
                target.style.borderColor = "var(--border-accent)";
                target.style.boxShadow = "0 0 40px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = "translateY(0)";
                target.style.borderColor = "var(--border)";
                target.style.boxShadow = "none";
              }}
            >
              <h2
                className="font-display"
                style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
              >
                {plan.name}
              </h2>
              <div
                className="font-display gradient-text-accent"
                style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.5rem" }}
              >
                {plan.price}
              </div>
              <ul style={{ flex: 1, listStyle: "none", padding: 0, margin: "0 0 2rem", width: "100%" }}>
                {plan.features.map((feature, fidx) => (
                  <li
                    key={fidx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.95rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontSize: "1.1rem" }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={idx === 1 ? "btn-glow" : "btn-ghost"}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "1rem",
                  borderRadius: 10,
                }}
              >
                Choose {plan.name}
              </button>
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

export default Pricing;
