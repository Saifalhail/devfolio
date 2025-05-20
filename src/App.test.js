import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page hero title', async () => {
  render(<App />);
  const heroTitle = await screen.findByText(/Let Me Turn Your Idea Into/i);
  expect(heroTitle).toBeInTheDocument();
});
