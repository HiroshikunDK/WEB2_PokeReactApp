import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Pokedex from './Pokedex';
import About from './About';
import PokemonDetail from './PokedexDetails';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link className="nav-link" to="/">Pokedex</Link>  
        <Link className="nav-link" to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/about" element={<About />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
