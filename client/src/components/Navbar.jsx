import { NavLink } from "react-router";

function Navbar() {
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
        </nav>

      </div>
    </header>
  );
}

export default Navbar;