import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // 👈 Şu anki sayfayı takip et

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/games', label: 'Games' },
    { to: '/about', label: 'About' },
    { to: '/solutions', label: 'Solutions' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/myntora-site/logo.png" alt="Myntora Logo" className="logo-img" />
        <h1 className="logo-text">MYNTORA</h1>
      </div>


      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={closeMenu}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
