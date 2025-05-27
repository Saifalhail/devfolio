import React from 'react';
import { render, screen } from './testUtils';
import HireAgain from '../components/Dashboard/PostLaunch/HireAgain';

describe('HireAgain Component', () => {
  test('renders hire again button', () => {
    render(<HireAgain />);
    const button = screen.getByTestId('hire-again-button');
    expect(button).toBeInTheDocument();
  });
});
