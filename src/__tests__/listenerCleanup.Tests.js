import React from 'react';
import { render, waitFor } from './testUtils';

// Use the real hook instead of the mock defined in setupTests
jest.unmock('../hooks/useFirebaseListener');
import useFirebaseListener from '../hooks/useFirebaseListener';

function TestComponent({ listenerSetup }) {
  useFirebaseListener(listenerSetup, []);
  return null;
}

test('useFirebaseListener cleans up Firebase listeners on unmount', async () => {
  const unsubscribe = jest.fn();
  const listenerSetup = jest.fn(() => unsubscribe);

  const { unmount } = render(<TestComponent listenerSetup={listenerSetup} />);
  await waitFor(() => expect(listenerSetup).toHaveBeenCalledTimes(1));

  unmount();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});
