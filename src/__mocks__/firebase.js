// Mock Firebase for offline testing
const firebaseMock = {
  // Auth mocks
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(callback => {
      callback(null);
      return jest.fn(); // Return unsubscribe function
    }),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid', email: 'test@example.com' } })),
    signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid', email: 'test@example.com' } })),
    signInWithPhoneNumber: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid', phoneNumber: '+1234567890' } })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid', email: 'test@example.com' } })),
    signOut: jest.fn(() => Promise.resolve()),
    GoogleAuthProvider: jest.fn(() => ({})),
    RecaptchaVerifier: jest.fn(() => ({
      render: jest.fn(),
      clear: jest.fn(),
      verify: jest.fn(() => Promise.resolve('verification-id')),
    })),
  },
  
  // Firestore mocks
  firestore: {
    collection: jest.fn(path => ({
      add: jest.fn(() => Promise.resolve({ id: 'test-doc-id' })),
      doc: jest.fn(id => ({
        get: jest.fn(() => Promise.resolve({
          exists: true,
          data: () => ({ id: id || 'test-doc-id', name: 'Test Document' }),
          id: id || 'test-doc-id',
        })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
        onSnapshot: jest.fn(callback => {
          callback({
            exists: true,
            data: () => ({ id: id || 'test-doc-id', name: 'Test Document' }),
            id: id || 'test-doc-id',
          });
          return jest.fn(); // Return unsubscribe function
        }),
      })),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          empty: false,
          docs: [
            {
              exists: true,
              data: () => ({ id: 'test-doc-id', name: 'Test Document' }),
              id: 'test-doc-id',
            },
          ],
        })),
        onSnapshot: jest.fn(callback => {
          callback({
            empty: false,
            docs: [
              {
                exists: true,
                data: () => ({ id: 'test-doc-id', name: 'Test Document' }),
                id: 'test-doc-id',
              },
            ],
          });
          return jest.fn(); // Return unsubscribe function
        }),
      })),
      onSnapshot: jest.fn(callback => {
        callback({
          empty: false,
          docs: [
            {
              exists: true,
              data: () => ({ id: 'test-doc-id', name: 'Test Document' }),
              id: 'test-doc-id',
            },
          ],
        });
        return jest.fn(); // Return unsubscribe function
      }),
    })),
  },
};

// Export mock functions that can be used in tests
export const auth = firebaseMock.auth;
export const firestore = firebaseMock.firestore;

// Default export for the entire firebase mock
export default firebaseMock;
