import React from 'react';
import { fireEvent, renderWithViewport, screen } from './testUtils';

// Mock i18n translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'en' } })
}));

import Dashboard from '../components/Dashboard/Dashboard';

// Mock useAuth to provide an authenticated user
jest.mock('../contexts/AuthContext', () => {
  const original = jest.requireActual('../contexts/AuthContext');
  return {
    ...original,
    useAuth: () => ({
      currentUser: { email: 'test@example.com', displayName: 'Test User' },
      logout: jest.fn()
    })
  };
});

// Mock Sidebar to avoid heavy rendering
jest.mock('../components/Dashboard/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

const renderDashboard = (device) => {
  return renderWithViewport(<Dashboard />, device);
};

describe('Dashboard Layout Responsive Behavior', () => {
  test('sidebar starts closed on mobile and opens when menu is clicked', () => {
    renderDashboard('mobileMedium');

    // Sidebar should start closed so body overflow is empty
    expect(document.body.style.overflow).toBe('');

    // Click menu toggle
    const toggle = screen.getByTestId('menu-toggle');
    fireEvent.click(toggle);

    // Sidebar open should disable body scrolling
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('sidebar is visible by default on desktop', () => {
    renderDashboard('desktop');

    // When desktop, sidebar is open so content margin is applied
    const sidebarArea = screen.getByTestId('sidebar-area');
    expect(sidebarArea).toBeTruthy();
    // Body scrolling should remain enabled
    expect(document.body.style.overflow).toBe('');
  });
});
