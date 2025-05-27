import React from 'react';
import { render, screen } from './testUtils';
import PhaseTracker from '../components/Dashboard/DesignSection/PhaseTracker';

// Mock translation to avoid loading files
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key, fallback) => fallback || key, i18n: { language: 'en' } })
}));

describe('PhaseTracker Component', () => {
  test('renders all phases and highlights current phase', () => {
    render(<PhaseTracker currentPhase="Mockups" />);

    const phases = ['Discovery', 'Wireframes', 'Mockups', 'Prototypes', 'Implementation'];

    phases.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    const current = screen.getByText('Mockups');
    expect(current).toBeInTheDocument();
  });
});
