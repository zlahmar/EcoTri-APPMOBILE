// Mock react-native-firebase pour Jest
const mockAuth = {
  currentUser: { uid: '123', email: 'test@ecotri.fr' },
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
};

const mockFirestore = {
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

const mockStorage = {
  ref: jest.fn(() => ({
    put: jest.fn(() => Promise.resolve()),
    getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/image.jpg')),
  })),
};

export default {
  auth: () => mockAuth,
  firestore: () => mockFirestore,
  storage: () => mockStorage,
};
