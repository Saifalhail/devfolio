import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../__mocks__/authContext';

function AuthFlow() {
  const { signup, login, logout } = useAuth();
  return (
    <div>
      <button onClick={() => signup('dev@foo.com', 'password', 'Dev')}>Signup</button>
      <button onClick={() => login('dev@foo.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('Authentication Integration Flow', () => {
  test('calls auth context methods sequentially', async () => {
    const signupMock = jest.fn(() => Promise.resolve({}));
    const loginMock = jest.fn(() => Promise.resolve({}));
    const logoutMock = jest.fn(() => Promise.resolve(true));

    render(
      <AuthProvider mockAuthState={{ signup: signupMock, login: loginMock, logout: logoutMock }}>
        <AuthFlow />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Signup'));
    await waitFor(() => expect(signupMock).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(logoutMock).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(loginMock).toHaveBeenCalled());
  });
});
