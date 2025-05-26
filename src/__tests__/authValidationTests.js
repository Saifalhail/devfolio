import React from 'react';
import { render, screen, fireEvent, waitFor } from './testUtils';
import AuthModal from '../components/Common/AuthModal';

// New validation specific tests for AuthModal

describe('AuthModal Form Validation', () => {
  const renderModal = () => render(<AuthModal isOpen={true} onClose={() => {}} />);

  test('shows error when sign-in fields are empty', async () => {
    renderModal();
    // open email sign-in form
    const emailButton = screen.getByText(/email/i);
    fireEvent.click(emailButton);

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/fill in all fields/i)).toBeTruthy();
    });
  });

  test('shows error for invalid sign-up email', async () => {
    renderModal();
    // switch to sign up mode
    const signUpLink = screen.getByText(/sign up/i);
    fireEvent.click(signUpLink);

    const signUpEmailButton = screen.getByText(/email/i);
    fireEvent.click(signUpEmailButton);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const nameInput = screen.getByPlaceholderText(/full name/i);

    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(nameInput, { target: { value: 'Test' } });

    const submitBtn = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeTruthy();
    });
  });
});
