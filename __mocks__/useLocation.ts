// Mock useLocation pour Jest
export const useLocation = () => ({
  city: 'Bordeaux',
  location: { latitude: 44.837789, longitude: -0.57918, city: 'Bordeaux', address: 'Bordeaux, France' },
  isLoading: false,
  hasLocation: true,
  getCurrentLocation: jest.fn(),
  refreshLocation: jest.fn(),
});
