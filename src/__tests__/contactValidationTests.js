import React from 'react';
import { render, screen, fireEvent, waitFor } from './testUtils';
import NewContact from '../components/Home/NewContact';

// Validation tests for the contact form

describe('Contact Form Validation', () => {
  const setup = () => render(<NewContact />);

  test('prevents submission of empty form', async () => {
    setup();

    const submitBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/required fields/i)).toBeTruthy();
    });
  });

  test('shows email validation error for invalid email', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hi' } });

    const submitBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeTruthy();
    });
  });
});
