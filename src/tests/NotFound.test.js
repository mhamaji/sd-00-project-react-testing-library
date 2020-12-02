import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { NotFound } from '../components';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('testes sobre componente NotFound', () => {
  it('testa se existe um título "Page requested not found 😭"', () => {
    const { getByRole } = renderWithRouter(<NotFound />);

    const titulo = getByRole('heading');
    expect(titulo).toHaveTextContent(/Page requested not found 😭/)
  });

  it('testa se existe uma imagem com a url desejada', () => {
    const { getByAltText } = renderWithRouter(<NotFound />);

    const image = getByAltText('Pikachu crying because the page requested was not found');
    expect(image).toHaveAttribute('src', 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
