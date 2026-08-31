import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/catalogue${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-brand-800 text-brand-50 shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          📚 Pagebound
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-brand-200">
            Home
          </Link>
          <Link to="/catalogue" className="hover:text-brand-200">
            Catalogue
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="ml-auto flex flex-1 max-w-sm items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author..."
            aria-label="Search books"
            className="w-full rounded-l-md border-0 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            type="submit"
            className="rounded-r-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline">Hi, {user.fullName?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-brand-300 px-3 py-1.5 font-semibold hover:bg-brand-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 font-semibold hover:bg-brand-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-500 px-3 py-1.5 font-semibold text-white hover:bg-brand-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
