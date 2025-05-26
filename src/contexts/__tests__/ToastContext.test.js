import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

function Consumer() {
  const { addToast, toasts } = useToast();
  return (
    <div>
      <span data-testid="has-add-toast">{typeof addToast === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="count">{toasts.length}</span>
    </div>
  );
}

describe('ToastContext Provider', () => {
  test('provides addToast function and toasts state', () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>
    );
    expect(screen.getByTestId('has-add-toast').textContent).toBe('yes');
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
