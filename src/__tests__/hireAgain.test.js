import React from 'react';
import { render, screen } from './testUtils';

// Mock i18n translation hook
jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: (key, fallback) => fallback || key, i18n: { language: 'en' } })
  };
});

import HireAgain from '../components/Dashboard/PostLaunch/HireAgain';

describe('HireAgain Component', () => {
  test('renders hire again button', () => {
    render(<HireAgain />);
    const button = screen.getByTestId('hire-again-button');
    expect(button).toBeInTheDocument();
  });
});
