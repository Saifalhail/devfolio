import React from 'react';
import { render, fireEvent, waitFor } from './testUtils';
import DesignKit from '../components/Dashboard/DesignSection/DesignKit';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}));

describe('DesignKit Component', () => {
  test('triggers zip download on click', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['logo']))
    });

    const createObjectURL = jest.fn(() => 'blob:url');
    global.URL.createObjectURL = createObjectURL;

    const link = { click: jest.fn() };
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return link;
      }
      return originalCreateElement(tag);
    });

    const { getByText } = render(<DesignKit />);
    fireEvent.click(getByText('design.downloadDesignKit'));

    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    expect(link.click).toHaveBeenCalled();
  });
});
