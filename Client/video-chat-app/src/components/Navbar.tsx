import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaVideo, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
];

interface User {
  name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect scroll for navbar bg opacity change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync auth state
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href.replace("/#", "/"));

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        background: scrolled ? "rgba(8,8,16,0.9)" : "rgba(8,8,16,0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "transparent"}`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6c63ff, #c084fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(108,99,255,0.45)",
            }}
          >
            <FaVideo style={{ color: "#fff", fontSize: 16 }} />
          </div>
          <span
            className="font-display"
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #fff 40%, #8b85ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VideoMeet
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flex: 1,
            justifyContent: "center",
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: isActive(link.href) ? "#fff" : "var(--text-secondary)",
                letterSpacing: "0.02em",
                transition: "color 0.2s",
                fontFamily: "DM Sans, sans-serif",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = isActive(link.href)
                  ? "#fff"
                  : "var(--text-secondary)")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          className="hidden md:flex"
        >
          {user ? (
            <>
              <Link
                to="/home"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                <FaVideo size={12} />
                Dashboard
              </Link>
              <div className="relative group" style={{ position: "relative" }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(108,99,255,0.12)",
                    border: "1px solid var(--border-accent)",
                    borderRadius: 8,
                    padding: "0.45rem 0.85rem",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <FaUserCircle size={16} style={{ color: "var(--accent-bright)" }} />
                  {user.name}
                </button>
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    minWidth: 140,
                    overflow: "hidden",
                    opacity: 0,
                    pointerEvents: "none",
                    transform: "translateY(-8px)",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                  className="group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "1";
                    el.style.pointerEvents = "auto";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "0.6rem 1rem",
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      textAlign: "left",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn-glow"
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen((p) => !p)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: 6,
          }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          style={{
            background: "rgba(8,8,16,0.97)",
            borderTop: "1px solid var(--border)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          className="md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                textDecoration: "none",
                color: isActive(link.href) ? "#fff" : "var(--text-secondary)",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
          <hr style={{ borderColor: "var(--border)", margin: "0.25rem 0" }} />
          {user ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FaUserCircle /> {user.name}
              </span>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.875rem" }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link to="/login" onClick={() => setIsOpen(false)} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>
                Log in
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-glow" style={{ padding: "0.45rem 1rem", borderRadius: 8, textDecoration: "none", fontSize: "0.875rem" }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
