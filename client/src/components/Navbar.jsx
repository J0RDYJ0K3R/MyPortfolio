
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";

const API_URL = "http://localhost:5000";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(sessionStorage.getItem("token"))
  );

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function updateAuth() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        if (active) {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const user = await response.json();

        if (active && token === sessionStorage.getItem("token")) {
          setIsLoggedIn(true);
          setIsAdmin(user.role === "admin");
        }
      } catch {
        if (active && token === sessionStorage.getItem("token")) {
          sessionStorage.removeItem("token");
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      }
    }

    const handleAuthChange = () => {
      updateAuth();
    };

    updateAuth();

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      active = false;
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);

    window.dispatchEvent(new Event("auth-change"));

    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* Custom portfolio logo */}
        <NavLink to="/" className="logo">
          <span className="logo-symbol">BSK</span>
          <span className="logo-text">Portfolio</span>
        </NavLink>

        {/* Navigation links */}
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Me</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <>
              {isAdmin && (
                <NavLink to="/admin">
                  Admin Dashboard
                </NavLink>
              )}

              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Navbar;
