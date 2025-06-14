import React from 'react';
import './Home.css';
import bg from '../assets/vintage.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to Myntora</h1>
          <p className="hero-subtitle">Where mystery meets design. Explore immersive printable escape games crafted with elegance and story.</p>
          

        </div>
      </div>

      <section className="intro-section">
        <h2>About Our Vision</h2>
        <p>Myntora is more than a game brand. It is a storytelling studio that brings digital mystery games to life through printable formats. Each experience is handcrafted with puzzles, narrative depth, and timeless aesthetics. We don't just make games — we make experiences that linger.</p>
      </section>
    </div>
  );
};

export default Home;
