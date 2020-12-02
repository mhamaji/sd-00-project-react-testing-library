import React from 'react';
import { Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Pokemon } from '../components';
import pokemons from '../data';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('testando arquivo Pokemon', () => {
  it('testa se são renderizadas as informações corretamente', () => {
    const poke = pokemons[0];
    const { getByText, getByAltText } = renderWithRouter(<Pokemon pokemon={ poke } />);

    const nome = getByText(poke.name);
    const pesoMedio = poke.averageWeight.value;
    const unidade = poke.averageWeight.measurementUnit;
    const peso = getByText(`Average weight:${pesoMedio}${unidade}`);
    const srcImage = poke.image;
    const altImage = getByAltText(`${poke.name} sprite`);
    const type = getByText(poke.type);

    expect(nome).toBeInTheDocument();
    expect(peso).toBeInTheDocument();
    expect(altImage).toHaveAttribute('src', srcImage);
    expect(type).toBeInTheDocument();
  });

  it('testa se o card possui um link de exibir detalhes', () => {
    const poke = pokemons[0];
    const { getByText, history } = renderWithRouter(<Pokemon pokemon={ poke } />);

    const linkDetalhes = getByText(/More details/);
    expect(linkDetalhes).toBeInTheDocument();

    fireEvent.click(linkDetalhes);
    const { pathname } = history.location;
    expect(pathname).toBe(`/pokemons/${poke.id}`);
  });

  it('testa se existe o ícone de estrela num pokemon favorito', () => {
    const poke = pokemons[0];

    const { getByAltText } = renderWithRouter(<Pokemon pokemon={ poke } isFavorite />);

    const srcImage = '/star-icon.svg';
    const altImage = getByAltText(`${poke.name} is marked as favorite`);
    expect(altImage).toHaveAttribute('src', srcImage);
  });
});
