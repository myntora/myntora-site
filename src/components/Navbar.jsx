import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Myntora</div>
      <ul className="navbar-links">
        <li><Link to="/Home">Home</Link></li>
        <li><Link to="/About">Information</Link></li>
        <li><Link to="/games">Games</Link></li>
        <li><Link to="/solutions">Solutions</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
