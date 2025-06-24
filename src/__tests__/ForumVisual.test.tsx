import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForumsHome from '../components/Dashboard/Forums/ForumsHome';
import { MockupUIProvider } from '../components/Dashboard/Forums/MockupUIContext';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/dashboard/forums' })
}));

describe('Forum Visual Components', () => {
  test('MockupCard has correct styling and button interactions', async () => {
    // Wrap ForumsHome in the required context provider
    render(
      <MockupUIProvider>
        <ForumsHome />
      </MockupUIProvider>
    );
    
    // Find a MockupCard element
    const mockupCard = document.querySelector('.card-glass');
    expect(mockupCard).toBeInTheDocument();
    
    // Check if the card has the correct background
    const cardStyle = window.getComputedStyle(mockupCard);
    expect(cardStyle.background).toContain('var(--clr-glass)');
    
    // Find an outline-accent button
    const outlineButton = document.querySelector('.btn-outline-accent');
    expect(outlineButton).toBeInTheDocument();
    
    // Check initial button styling
    const buttonStyle = window.getComputedStyle(outlineButton);
    expect(buttonStyle.background).toBe('transparent');
    
    // Simulate hover and check if background changes
    await userEvent.hover(outlineButton);
    const hoverStyle = window.getComputedStyle(outlineButton);
    expect(hoverStyle.background).toBe('var(--clr-accent)');
  });
});
