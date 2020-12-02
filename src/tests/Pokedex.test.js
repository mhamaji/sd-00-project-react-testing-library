import React from 'react';
import { Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Pokedex from '../components/Pokedex';
import pokemons from '../data';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('testando arquivo Pokedex', () => {
  it('testa se é exibido o próximo pokemon da lista', () => {
    const { getByText } = renderWithRouter(
      <Pokedex pokemons={ pokemons } isPokemonFavoriteById={ {} } />,
    );

    const botaoProximo = getByText(/Próximo pokémon/);
    expect(botaoProximo).toBeInTheDocument();

    pokemons.forEach((pokemon, index) => {
      const nomePokemon = getByText(pokemon.name);
      expect(nomePokemon).toBeInTheDocument();

      fireEvent.click(botaoProximo);

      const tamanhoPokemons = pokemons.length;
      const indexProxPoke = (index === tamanhoPokemons - 1)
        ? ((index + 1) - tamanhoPokemons)
        : (index + 1);

      const proxPoke = getByText(pokemons[indexProxPoke].name);
      expect(proxPoke).toBeInTheDocument();
    });
  });

  it('testa se é mostrado só um pokemon por vez, usando data-testid', () => {
    const { getAllByTestId } = renderWithRouter(
      <Pokedex pokemons={ pokemons } isPokemonFavoriteById={ {} } />,
    );

    const dataTestIdNome = getAllByTestId('pokemon-name');
    expect(dataTestIdNome.length).toBe(1);
  });

  it('testa se a pokedex tem os botões de filtro', () => {
    const { getAllByTestId, getByTestId } = renderWithRouter(
      <Pokedex pokemons={ pokemons } isPokemonFavoriteById={ {} } />,
    );

    // recuperando os botões que têm esse data-testid e verificando se são 7:
    const testIdBotoes = getAllByTestId('pokemon-type-button');
    const sete = 7;
    expect(testIdBotoes.length).toBe(sete);

    // recuperando id do elemento que guarda o tipo de cada pokemon:
    const testIdTipoPokemon = getByTestId('pokemonType');

    testIdBotoes.forEach((tipo) => {
      fireEvent.click(tipo);
      // verificando se o texto do tipo do pokemon é igual ao texto do botão
      // que está dentro de tipo
      expect(testIdTipoPokemon.textContent).toBe(tipo.textContent);
    });
  });

  it('testa o botão All reseta os filtros', () => {
    const { getByText } = renderWithRouter(
      <Pokedex pokemons={ pokemons } isPokemonFavoriteById={ {} } />,
    );

    // faltava testar o botão All, garantindo que ele está na tela e tem este valor
    const botaoAll = getByText(/All/);
    expect(botaoAll).toBeInTheDocument();
    fireEvent.click(botaoAll);

    const primeiroPokemon = getByText(pokemons[0].name);
    expect(primeiroPokemon).toBeInTheDocument();

    const botaoProximo = getByText(/Próximo pokémon/);
    fireEvent.click(botaoProximo);

    const segundoPokemon = getByText(pokemons[1].name);
    expect(segundoPokemon).toBeInTheDocument();

    fireEvent.click(botaoProximo);

    const terceiroPokemon = getByText(pokemons[2].name);
    expect(terceiroPokemon).toBeInTheDocument();
  });

  it('testa se o botão de próximo pokemon desabilita quando houver só um pokemon', () => {
    const { getByText } = renderWithRouter(
      <Pokedex pokemons={ pokemons } isPokemonFavoriteById={ {} } />,
    );

    // testando se ao clicar no botão Electric desabilita o botão de próximo:
    const botaoProximo = getByText(/Próximo pokémon/);
    const botaoElectric = getByText('Electric', { selector: 'button' });

    fireEvent.click(botaoElectric);

    expect(botaoProximo).toBeDisabled();

    // testando se ao clicar no botão Bug também desabilita:
    const botaoBug = getByText('Bug', { selector: 'button' });

    fireEvent.click(botaoBug);

    expect(botaoProximo).toBeDisabled();
  });

  it('testa se existe a frase de pokemons encntrados', () => {
    const { getByText } = renderWithRouter(
      <Pokedex pokemons={ pokemons } isPokemonFavoriteById={ {} } />,
    );

    const frase = getByText(/Encountered pokémons/);
    expect(frase).toBeInTheDocument();
  });
});

/*
para conseguir implementar os testes da pokedex, adaptei as formas como o Luiz
Simões e o Bergamini implementaram seus códigos para algo mais próximo da minha
realidade, conforme fazia mais sentido pra mim e testando o que de fato é pedido
nos requisitos. Segue o PR dos dois que me ajudaram muito a construir este arquivo
de testes.
link PR Bergamini: https://github.com/tryber/sd-06-project-react-testing-library/pull/105/files
link PR Luiz: https://github.com/tryber/sd-06-project-react-testing-library/pull/12/files
*/
