import React from 'react';
import { Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from '../App';
import pokemons from '../data';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('testando o arquivo PokemonDetails a partir de App', () => {
  it('testa se as informações detalhadas do pokemon estão corretas', () => {
    const { getByText, getByRole, history } = renderWithRouter(<App />);

    const zero = 0;
    pokemons.forEach((pokemon, index) => {
      const { name, summary, id } = pokemon;

      const linkMaisDetalhes = getByText(/More details/);
      expect(linkMaisDetalhes).toBeInTheDocument();

      fireEvent.click(linkMaisDetalhes);

      const { pathname } = history.location;
      expect(pathname).toBe(`/pokemons/${id}`);

      // testando se tem o título Name Details:
      const titulo = getByText(`${name} Details`);
      expect(titulo).toBeInTheDocument();

      // garantindo que não existe o link de mais detalhes nesta página:
      expect(linkMaisDetalhes).not.toBeInTheDocument();

      // testando se há o título Summary:
      const heading = getByText(/Summary/i);
      expect(heading).toBeInTheDocument();

      // testando se há o parágrafo de resumo:
      const paragrafoSummary = getByText(summary);
      expect(paragrafoSummary).toBeInTheDocument();

      // retornando à rota principal para refazer todo o teste no próximo pokemon:
      history.push('/');
      const nextButton = getByRole('button', { name: 'Próximo pokémon' });
      for (let i = index; i >= zero; i -= 1) fireEvent.click(nextButton);
    });
  });

  it('testa se existem as informações dos mapas de cada pokemon', () => {
    const { getByText, getByRole, getAllByRole, history } = renderWithRouter(<App />);

    const zero = 0;
    pokemons.forEach((pokemon, index) => {
      const { name, id, foundAt } = pokemon;

      const linkMaisDetalhes = getByText(/More details/);
      expect(linkMaisDetalhes).toBeInTheDocument();

      fireEvent.click(linkMaisDetalhes);

      const { pathname } = history.location;
      expect(pathname).toBe(`/pokemons/${id}`);

      // testando se há o título Game Locations:
      const heading = getByText(`Game Locations of ${name}`);
      expect(heading).toBeInTheDocument();

      // mostra todas as localizações:
      const image = getAllByRole('img', { name: `${name} location` });
      foundAt.forEach((local, indexLocal) => {
        const imageLocalizacao = image[indexLocal];
        const nomeLocal = getByText(local.location);
        const srcImageLocal = local.map;
        expect(nomeLocal).toBeInTheDocument();
        expect(imageLocalizacao).toBeInTheDocument();
        expect(imageLocalizacao).toHaveAttribute('src', srcImageLocal);
      });

      // retornando à rota principal para refazer todo o teste no próximo pokemon:
      history.push('/');
      const nextButton = getByRole('button', { name: 'Próximo pokémon' });
      for (let i = index; i >= zero; i -= 1) fireEvent.click(nextButton);
    });
  });

  it('testa se é possível favoritar um pokemon na página de detalhes', () => {
    const { getByText, getByRole, getByLabelText, history } = renderWithRouter(<App />);

    const zero = 0;
    pokemons.forEach((pokemon, index) => {
      const { name, id } = pokemon;

      const linkMaisDetalhes = getByText(/More details/);
      expect(linkMaisDetalhes).toBeInTheDocument();

      fireEvent.click(linkMaisDetalhes);

      const { pathname } = history.location;
      expect(pathname).toBe(`/pokemons/${id}`);

      const checkBox = getByLabelText('Pokémon favoritado?');
      expect(checkBox).toBeInTheDocument();

      // click que vai tornar o pokemons favoritado
      fireEvent.click(checkBox);

      const imgEstrelinha = getByRole('img', { name: `${name} is marked as favorite` });
      expect(imgEstrelinha).toBeInTheDocument();
      expect(imgEstrelinha).toHaveAttribute('src', '/star-icon.svg');

      // click que desfavorita o pokemon:
      fireEvent.click(checkBox);

      expect(imgEstrelinha).not.toBeInTheDocument();

      // retornando à rota principal para refazer todo o teste no próximo pokemon:
      history.push('/');
      const nextButton = getByRole('button', { name: 'Próximo pokémon' });
      for (let i = index; i >= zero; i -= 1) fireEvent.click(nextButton);
    });
  });
});
/* novamente o PR do Mariano me ajudou a estruturar este teste. A lógica de
redirecionamento para a rota '/' no forEach é fantástica e não vi um outro modo
de fazer se não como ele implementou.
Segue link do PR: https://github.com/tryber/sd-06-project-react-testing-library/pull/102/files
 */