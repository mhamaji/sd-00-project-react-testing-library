import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { About } from '../components';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('testes sobre componente about', () => {
  it('testa se existe um título "About Pokédex"', () => {
    const { getByRole } = renderWithRouter(<About />);

    const titulo = getByRole('heading');
    expect(titulo).toHaveTextContent(/About Pokédex/);
  });

  it('testa se existe dois parágrafos', () => {
    const { container } = renderWithRouter(<About />);

    const paragrafos = container.querySelectorAll('p');
    const qtdParagrafos = 2;
    expect(paragrafos.length).toBe(qtdParagrafos);
  });

  it('testa se existe uma imagem com a url desejada', () => {
    const { getByRole } = renderWithRouter(<About />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', 'https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});

/* O PR do Luiz Simões também foi muito importante para que eu conseguisse
destravar ontem na parte de selecionar os 2 parágrafos usando o container, já
havia tentado de várias formas mas sem sucesso. Segue o link:
https://github.com/tryber/sd-06-project-react-testing-library/pull/12/files
*/
