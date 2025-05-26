import React from 'react';
import { render, fireEvent } from './testUtils';
import Tabs from '../components/Common/Tabs';

// Mock react-i18next to avoid needing translation files
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'en' } })
}));

describe('Tabs Component', () => {
  const tabs = [
    { id: 'first', label: 'First', content: <div data-testid="first-content">One</div> },
    { id: 'second', label: 'Second', content: <div data-testid="second-content">Two</div> }
  ];

  test('renders initial tab and switches on click', () => {
    const { getByText, queryByTestId } = render(<Tabs tabs={tabs} />);

    // Initial content shown
    expect(queryByTestId('first-content')).toBeTruthy();
    expect(queryByTestId('second-content')).toBeNull();

    // Switch tabs
    fireEvent.click(getByText('Second'));
    expect(queryByTestId('second-content')).toBeTruthy();
    expect(queryByTestId('first-content')).toBeNull();
  });
});
