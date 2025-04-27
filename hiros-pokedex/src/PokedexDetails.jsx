import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => res.json())
      .then(data => setPokemon(data));
  }, [name]);

  if (!pokemon) return <div>Loading...</div>;

  return (
    <div>
      <h2>{pokemon.name.toUpperCase()}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
      <p><strong>Stats:</strong></p>
      <ul>
        {pokemon.stats.map(s => (
          <li key={s.stat.name}>{s.stat.name}: {s.base_stat}</li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonDetail;
