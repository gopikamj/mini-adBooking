import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user info from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page after logout
    setUser(null);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Newspaper Ads</Link>
        
        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/book-ad">Book Ad</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          
          {user && <li><Link to="/dashboard">Dashboard</Link></li>}

          {user ? (
            <>
              <li className="welcome">Welcome, {user.name}</li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 