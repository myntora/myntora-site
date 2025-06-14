import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo-text">Myntora</h2>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">Information</Link>
        <Link to="/games">Games</Link>
      </div>
    </nav>
  );
};

export default Navbar;
