// Mock AsyncStorage avant l'import
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

import statsService, { UserStats, ScanResult } from '../../src/services/statsService';

describe('StatsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return null if no stats exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await statsService.getStats();

      expect(result).toBeNull();
    });

    it('should handle invalid JSON in storage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await statsService.getStats();

      expect(result).toBeNull();
    });
  });

  describe('getScanHistory', () => {
    it('should return empty array if no history exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await statsService.getScanHistory();

      expect(result).toEqual([]);
    });
  });

  describe('addScan', () => {
    it('should throw error if stats not initialized', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      await expect(statsService.addScan('plastic', 0.8)).rejects.toThrow('Statistiques non initialisées');
    });
  });

  describe('addRecyclingPointSearch', () => {
    it('should throw error if stats not initialized', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      await expect(statsService.addRecyclingPointSearch()).rejects.toThrow('Statistiques non initialisées');
    });
  });
});
