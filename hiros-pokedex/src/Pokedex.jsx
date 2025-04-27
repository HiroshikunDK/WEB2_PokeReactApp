import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './index.css';

const fetchAllTypes = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/type');
  const data = await res.json();
  return data.results.map(type => type.name);
};

const fetchPokemonDetails = async (pokemonUrls, page,limit) => {
  // Limit the number of Pokémon URLs to the limit 
  const limitedUrls = pokemonUrls.slice((page * limit), ((page+1) * limit));

  return await Promise.all(
    limitedUrls.map(async (url) => {
      const res = await fetch(url);
      const details = await res.json();
      return {
        name: details.name,
        types: details.types.map((t) => t.type.name),
        sprite: details.sprites.front_default,
      };
    })
  );
};

const getDetailedPokemonData = async (pokemonArray) => {
  return await Promise.all(
    pokemonArray.map(async (p) => {
      const res = await fetch(p.url);
      const details = await res.json();
      return {
        name: p.name,
        types: details.types.map(t => t.type.name),
        sprite: details.sprites.front_default,
      };
    })
  );
};

function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 21;
  const [allTypes, setAllTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      console.log("Selected Type:", selectedType);
      let res;
      if (selectedType !== 'all') {
        // Fetch data from type endpoint
        res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        if (!res.ok) {
          console.error('Error fetching data for type', selectedType);
          return;
        }
        const data = await res.json();
        console.log("Hello wolrd! 1");

        const pokemonUrls = data.pokemon.map(pokemon => pokemon.pokemon.url);
        console.log("Hello wolrd! 1,2");

        const detailedData = await fetchPokemonDetails(pokemonUrls, page, limit);
        console.log("Hello wolrd! 1,3");
        setPokemonList(detailedData);
      } else {
        // Fetch data from the generic Pokémon endpoint when 'all' is selected
        res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page * limit}&limit=${limit}`);
        if (!res.ok) {
          console.error('Error fetching pokemons', selectedType);
          return;
        }
        const data = await res.json();

        const detailedData = await getDetailedPokemonData(data.results);
        setPokemonList(detailedData);
      }
    };
  
    fetchData();
  }, [page, selectedType]);

 // Get the list of all types
useEffect(() => {
  const loadTypes = async () => {
    const types = await fetchAllTypes();
    setAllTypes(types); // Set the types in state
  };
    loadTypes();
}, []); // Run once on mount

  return (
    <div>
      {/* Title */}
      <h1>Pokédex</h1>
      
      {/* Filter by Type */}
      <div className="filter-bar">
        <label htmlFor="typeFilter">Filter by Type: </label>
        <select 
          id="typeFilter" 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
        <option value="all">All Types</option>
          {allTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
            
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <div className="container pokemon-card" key={pokemon.name}>
            <div className="">
              <img
                className="PokemonSprite"
                src={pokemon.sprite}
                alt={pokemon.name}
              />
            </div>
            <div className="">
              <Link to={`/pokemon/${pokemon.name}`} className="pokemon-name">
                {pokemon.name}
              </Link>
              <div className="type-icons">
                {pokemon.types.map(type => (
                  <img
                    key={type}
                    src={`/icons/${type}.svg`}
                    alt={type}
                    className="type-icon"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Page Control */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 0))}>Previous</button>
        <span>Page {page + 1}</span> {/* Display current page number */}
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default Pokedex;