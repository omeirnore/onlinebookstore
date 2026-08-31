import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function CartLink({ count, onClick, className = "" }) {
  return (
    <Link to="/cart" onClick={onClick} className={`relative hover:text-brand-200 ${className}`}>
      🛒 Cart
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, clear } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/catalogue${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    clear();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-brand-800 text-brand-50 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight text-white" onClick={() => setMenuOpen(false)}>
          📚 Pagebound
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
          <Link to="/" className="hover:text-brand-200">
            Home
          </Link>
          <Link to="/catalogue" className="hover:text-brand-200">
            Catalogue
          </Link>
          <CartLink count={totalItems} />
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden flex-1 max-w-sm items-center sm:flex">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author..."
            aria-label="Search books"
            className="w-full min-w-0 rounded-l-md border-0 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            type="submit"
            className="flex-shrink-0 rounded-r-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Search
          </button>
        </form>

        <div className="ml-auto hidden items-center gap-3 text-sm sm:ml-0 sm:flex">
          {isAuthenticated ? (
            <>
              <span className="hidden lg:inline">Hi, {user.fullName?.split(" ")[0]}</span>
              <Link to="/orders" className="rounded-md px-3 py-1.5 font-semibold hover:bg-brand-700">
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md border border-brand-300 px-3 py-1.5 font-semibold hover:bg-brand-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-1.5 font-semibold hover:bg-brand-700">
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

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="ml-auto flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-brand-500 sm:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-brand-700 px-4 pb-4 pt-3 sm:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or author..."
              aria-label="Search books"
              className="w-full min-w-0 rounded-l-md border-0 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="submit"
              className="flex-shrink-0 rounded-r-md bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Search
            </button>
          </form>

          <nav className="mb-3 flex flex-col gap-2 text-sm font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-brand-200">
              Home
            </Link>
            <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="hover:text-brand-200">
              Catalogue
            </Link>
            <CartLink count={totalItems} onClick={() => setMenuOpen(false)} className="w-fit" />
          </nav>

          <div className="flex flex-col gap-2 text-sm">
            {isAuthenticated ? (
              <>
                <span>Hi, {user.fullName?.split(" ")[0]}</span>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md border border-brand-300 px-3 py-2 text-center font-semibold hover:bg-brand-700"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-brand-300 px-3 py-2 text-center font-semibold hover:bg-brand-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md border border-brand-300 px-3 py-2 text-center font-semibold hover:bg-brand-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-brand-500 px-3 py-2 text-center font-semibold text-white hover:bg-brand-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
