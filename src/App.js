import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Games from './pages/Games';
import Solutions from './pages/Solutions.jsx';
import './App.css';


const BASENAME =
  process.env.NODE_ENV === 'production' ? '/myntora-site' : '/';

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/games" element={<Games />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
