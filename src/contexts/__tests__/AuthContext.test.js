import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('firebase/auth', () => ({
  __esModule: true,
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  signOut: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../firebase');

function Consumer() {
  const context = useAuth();
  return (
    <div>
      <span data-testid="has-functions">
        {['signInWithEmail', 'signup', 'logout', 'signInWithGoogle'].every(key => typeof context[key] === 'function') ? 'yes' : 'no'}
      </span>
      <span data-testid="user">{context.currentUser ? 'user' : 'none'}</span>
    </div>
  );
}

describe('AuthContext Provider', () => {
  test('provides authentication functions and state', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-functions').textContent).toBe('yes');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });
});
