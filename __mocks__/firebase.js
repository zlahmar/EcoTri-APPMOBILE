// Mock Firebase pour Jest
export const auth = {
  currentUser: { uid: '123', email: 'test@ecotri.fr' },
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
};

export const firestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: () => ({ name: 'EcoTri' }) })),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve()),
    where: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ docs: [] })),
    })),
  })),
};

export const storage = {
  ref: jest.fn(() => ({
    put: jest.fn(() => Promise.resolve()),
    getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/image.jpg')),
  })),
};

// Mock par défaut
export default {
  auth: () => auth,
  firestore: () => firestore,
  storage: () => storage,
};
