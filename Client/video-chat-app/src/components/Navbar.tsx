import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { FaVideo, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact Us", href: "/contact" },
];

interface User {
  name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Listen for login/logout in other tabs
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) setUser(JSON.parse(updatedUser));
      else setUser(null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Live search logic
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm.trim()) return setSearchResults([]);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/search?query=${searchTerm}`
        );
        const data: User[] = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between gap-4 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <FaVideo size={40} color="blue" />
          <span className="text-2xl font-semibold text-blue-700">VideoMeet</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}

          {/* Search Input */}
          <div className="relative">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-lg max-h-60 overflow-auto z-50">
                {searchResults.map((u) => (
                  <div
                    key={u.email}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${u.email}`);
                      setSearchTerm("");
                      setSearchResults([]);
                    }}
                  >
                    {u.name} ({u.email})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <FaUserCircle size={28} />
                  <span className="text-gray-800">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded-lg shadow-md w-36">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link to="/login" className="hover:text-blue-600">
                  Login
                </Link>
                <span>/</span>
                <Link to="/signup" className="hover:text-blue-600">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 font-medium text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}

          <div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {/* Optional: show search results below mobile search */}
            {searchResults.length > 0 && (
              <div className="mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-lg max-h-60 overflow-auto z-50">
                {searchResults.map((u) => (
                  <div
                    key={u.email}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${u.email}`);
                      setSearchTerm("");
                      setSearchResults([]);
                      setIsOpen(false);
                    }}
                  >
                    {u.name} ({u.email})
                  </div>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <FaUserCircle size={24} /> {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <span>/</span>
              <Link to="/signup" className="hover:text-blue-600">
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
