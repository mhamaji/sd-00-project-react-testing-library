import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from '../App';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('shows the Pokédex when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={ ['/'] }>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

describe('verificando conjunto de links de navegação', () => {
  it('link home', () => {
    const { getByText, history } = renderWithRouter(<App />);

    const linkHome = getByText(/Home/);
    expect(linkHome).toBeInTheDocument();

    fireEvent.click(linkHome);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });

  it('link about', () => {
    const { getByText, history } = renderWithRouter(<App />);

    const linkAbout = getByText(/About/);
    expect(linkAbout).toBeInTheDocument();

    fireEvent.click(linkAbout);
    const { pathname } = history.location;
    expect(pathname).toBe('/about');
  });

  it('link pokemons favoritos', () => {
    const { getByText, history } = renderWithRouter(<App />);

    const linkFavoritos = getByText(/Favorite Pokémons/);
    expect(linkFavoritos).toBeInTheDocument();

    fireEvent.click(linkFavoritos);
    const { pathname } = history.location;
    expect(pathname).toBe('/favorites');
  });

  it('página não encontrada', () => {
    const { getByText, history } = renderWithRouter(<App />);

    history.push('/url-desconhecida');

    const textoNotFound = getByText(/Page requested not found/);
    expect(textoNotFound).toBeInTheDocument();
  });
});
