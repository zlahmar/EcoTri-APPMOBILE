// Mock ciblé pour localStatsService
const localStatsService = {
  getStats: jest.fn(() => Promise.resolve({
    totalScans: 0,
    totalRecyclingPointSearches: 0,
    scanHistory: [],
    recyclingPointSearchHistory: [],
  })),
  addScan: jest.fn(() => Promise.resolve({ message: 'Scan ajouté' })),
  addRecyclingPointSearch: jest.fn(() => Promise.resolve({ message: 'Recherche enregistrée' })),
  updateStats: jest.fn(() => Promise.resolve()),
  resetStats: jest.fn(() => Promise.resolve()),
};

export default localStatsService;
