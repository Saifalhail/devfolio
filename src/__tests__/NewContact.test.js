// Tests for NewContact form submission
import React from 'react';
import { render, fireEvent, waitFor } from './testUtils';
import NewContact from '../components/Home/NewContact';
import { httpsCallable } from 'firebase/functions';

jest.mock('firebase/functions', () => ({
  httpsCallable: jest.fn(() => jest.fn(() => Promise.resolve({ data: { success: true } }))),
  getFunctions: jest.fn(() => ({})),
}));

describe('NewContact Submission', () => {
  beforeEach(() => {
    httpsCallable.mockClear();
  });

  test('submits form data when valid', async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ data: { success: true } }));
    httpsCallable.mockImplementation(() => mockSubmit);

    const { container } = render(<NewContact />);

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const messageInput = container.querySelector('textarea[name="message"]');
    const submitButton = container.querySelector('button[type="submit"]');

    fireEvent.change(nameInput, { target: { value: 'Codex User' } });
    fireEvent.change(emailInput, { target: { value: 'codex@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello from Codex' } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    const callArgs = mockSubmit.mock.calls[0][0];
    expect(callArgs).toMatchObject({
      name: 'Codex User',
      email: 'codex@example.com',
      message: 'Hello from Codex',
    });
  });
});
