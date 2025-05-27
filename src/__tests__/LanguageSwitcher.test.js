import React from 'react';
import { render, fireEvent } from './testUtils';
import LanguageSwitcher from '../components/Common/LanguageSwitcher';

const mockChangeLanguage = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: mockChangeLanguage }
  })
}));

describe('LanguageSwitcher Keyboard Accessibility', () => {
  test('triggers language change on Enter key press', () => {
    const { getByRole } = render(<LanguageSwitcher />);
    const button = getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });
});
