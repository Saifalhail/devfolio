import React from 'react';
import { render, fireEvent } from './testUtils';
import MockupUpload from '../components/Dashboard/DesignSection/MockupUpload';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'en' } })
}));

describe('MockupUpload Component', () => {
  test('shows image preview after file selection', () => {
    const { getByLabelText, getByAltText } = render(<MockupUpload />);
    const input = getByLabelText('design.uploadMockups');
    const file = new File(['dummy'], 'preview.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(getByAltText('preview.png')).toBeInTheDocument();
  });
});
