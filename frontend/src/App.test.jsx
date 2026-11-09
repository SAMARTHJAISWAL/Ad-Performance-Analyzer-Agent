import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the dashboard with links to upload and analysis', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /welcome to the ad performance analyzer/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /upload ad data/i })).toHaveAttribute('href', '/upload');
  expect(screen.getByRole('link', { name: /view analysis results/i })).toHaveAttribute('href', '/analyze');
});
