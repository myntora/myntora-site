import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Myntora</div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/games" onClick={closeMenu}>Games</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/solutions" onClick={closeMenu}>Solutions</Link></li>
      </ul>

      <button className="menu-toggle" onClick={toggleMenu}>
        <FiMenu />
      </button>

    </nav>
  );
};

export default Navbar;
