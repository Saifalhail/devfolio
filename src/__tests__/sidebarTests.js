import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, renderWithViewport } from './testUtils';
import Sidebar from '../components/Dashboard/Sidebar';

describe('Dashboard Sidebar', () => {
  test('renders navigation menu items', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
  });

  test('collapse button triggers callback', () => {
    const onToggle = jest.fn();
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar onToggleCollapse={onToggle} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalled();
  });

  test('renders correctly on mobile viewport', () => {
    renderWithViewport(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>,
      'mobileSmall'
    );

    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
  });
});
