import React from 'react';
import { render } from '@testing-library/react';
import App from '../components/App.jsx';

// LEENA: use this or get rid of it

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
