import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-split-container">
      <div className="about-left">
        <h1>About Myntora</h1>
        <p className="tagline">A world of stories, puzzles, and immersive mysteries.</p>

        <section>
          <h2>Who We Are</h2>
          <p><strong>Myntora</strong> is an independent creative studio that designs printable escape room games, detective mysteries, and emotionally immersive story-based puzzles.</p>

          <h2>What We Create</h2>
          <ul>
            <li><strong>🕵️ Detective Mystery Games:</strong> Investigate documents, cross-reference clues, and uncover truths.</li>
            <li><strong>🔐 Escape Room Games:</strong> Crack codes, solve puzzles, and escape immersive scenarios.</li>
          </ul>

          <h2>What Makes Us Different</h2>
          <p>Each game is uniquely handwritten and crafted with emotional depth. We prioritize cleverness over confusion.</p>

          <h2>Our Story</h2>
          <p>Founded in <strong>May 2025</strong> by <strong>Morgan Thorne</strong>, Myntora began as a small Etsy shop and grew into a hub for intelligent entertainment.</p>

          <h2>Find Us</h2>
          <ul className="contact-info">
            <li><strong>📍 Location:</strong> New York, United States</li>
            <li><strong>📧 Email:</strong> <a href="mailto:morgan@myntora.com">morgan@myntora.com</a></li>
            <li><strong>🛒 Etsy:</strong> <a href="https://myntora.etsy.com" target="_blank" rel="noopener noreferrer">myntora.etsy.com</a></li>
          </ul>

          <h2>Why Myntora?</h2>
          <p>For thinkers and dreamers. We design for those who seek more than just fun — we offer memorable experiences.</p>
        </section>
      </div>

    </div>
  );
};

export default About;
