import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { FavoritePokemons } from '../components';
import pokemons from '../data';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('testando aquivo FavoritePokémons', () => {
  it('testa se exibe mensagem de nenhum pokemon favorito encontrado', () => {
    const arrayVazio = [];
    const { getByText } = renderWithRouter(<FavoritePokemons pokemons={ arrayVazio } />);
    const notFound = getByText(/No favorite pokemon found/);
    expect(notFound).toBeInTheDocument();
  });

  it('testa se são exibidos os cards de pokemons favoritos', () => {
    const arrayFavoritos = [pokemons[0], pokemons[1], pokemons[2]];
    const { getByText } = renderWithRouter(
      <FavoritePokemons pokemons={ arrayFavoritos } />,
    );
    arrayFavoritos.forEach((favorito) => {
      const nomePokemon = getByText(favorito.name);
      expect(nomePokemon).toBeInTheDocument();
    });
  });

  it('testa se somente os pokemons favoritos são exibidos', () => {
    const arrayFavoritos = [pokemons[0], pokemons[2], pokemons[4]];
    const arrayNaoFavoritos = [pokemons[1], pokemons[3], pokemons[5]];
    const { queryByText } = renderWithRouter(
      <FavoritePokemons pokemons={ arrayFavoritos } />,
    );
    arrayNaoFavoritos.forEach((naoFavorito) => {
      const nomePokemon = queryByText(naoFavorito.name);
      expect(nomePokemon).not.toBeInTheDocument();
    });
  });
});

/* estava com dificuldades em entender como estruturar o teste: na criação
de arrays conforme minha necessidade usando o arquivo data como base. O PR do
Mariano me ajudou muito a entender como deveria ser feito. Segue o link:
https://github.com/tryber/sd-06-project-react-testing-library/pull/102/files
*/
