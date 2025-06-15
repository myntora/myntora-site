import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Games from './pages/Games';
import Solutions from './pages/Solutions';
import About from './pages/About';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router basename="/myntora-site">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
