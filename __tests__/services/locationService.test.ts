// Mock des modules avant l'import
jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn(),
  requestAuthorization: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  PermissionsAndroid: {
    check: jest.fn(),
    request: jest.fn(),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
  },
}));

// Mock fetch pour l'API Nominatim
global.fetch = jest.fn();

// Import après les mocks
import locationService, { LocationData } from '../../src/services/locationService';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (locationService as any).currentLocation = null;
    (locationService as any).isRequestingLocation = false;
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton pattern)', () => {
      const instance1 = locationService;
      const instance2 = locationService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('checkPermission', () => {
    it('should check location permissions on Android', async () => {
      const mockCheck = PermissionsAndroid.check as jest.MockedFunction<typeof PermissionsAndroid.check>;
      mockCheck.mockResolvedValue(true);

      const result = await locationService.checkPermission();
      
      expect(mockCheck).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      expect(result).toBe(true);
    });

    it('should return false when permission is denied', async () => {
      const mockCheck = PermissionsAndroid.check as jest.MockedFunction<typeof PermissionsAndroid.check>;
      mockCheck.mockResolvedValue(false);

      const result = await locationService.checkPermission();
      
      expect(result).toBe(false);
    });
  });

  describe('requestPermission', () => {
    it('should request location permissions on Android', async () => {
      const mockRequest = PermissionsAndroid.request as jest.MockedFunction<typeof PermissionsAndroid.request>;
      mockRequest.mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

      const result = await locationService.requestPermission();
      
      expect(mockRequest).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        expect.any(Object)
      );
      expect(result).toBe(true);
    });

    it('should return false when permission is denied', async () => {
      const mockRequest = PermissionsAndroid.request as jest.MockedFunction<typeof PermissionsAndroid.request>;
      mockRequest.mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

      const result = await locationService.requestPermission();
      
      expect(result).toBe(false);
    });
  });

  describe('getCurrentLocation', () => {
    it('should get current location successfully', async () => {
      // Mock des permissions
      const mockCheck = PermissionsAndroid.check as jest.MockedFunction<typeof PermissionsAndroid.check>;
      mockCheck.mockResolvedValue(true);

      const mockPosition = {
        coords: {
          latitude: 44.837789,
          longitude: -0.57918,
          accuracy: 10,
          altitude: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.MockedFunction<typeof Geolocation.getCurrentPosition>;
      mockGetCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ 
          address: { 
            city: 'Bordeaux',
            town: null,
            village: null,
            county: null
          } 
        }),
      } as Response);

      const result = await locationService.getCurrentLocation();

      expect(mockGetCurrentPosition).toHaveBeenCalled();
      expect(result).toEqual({
        latitude: 44.837789,
        longitude: -0.57918,
        city: 'Bordeaux',
        address: null,
      });
    });

    it('should handle geolocation errors', async () => {
      const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.MockedFunction<typeof Geolocation.getCurrentPosition>;
      mockGetCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'Location permission denied' } as any);
      });

      const result = await locationService.getCurrentLocation();
      expect(result).toBeNull();
    });

    it('should handle reverse geocoding errors', async () => {
      // Mock des permissions
      const mockCheck = PermissionsAndroid.check as jest.MockedFunction<typeof PermissionsAndroid.check>;
      mockCheck.mockResolvedValue(true);

      const mockPosition = {
        coords: {
          latitude: 44.837789,
          longitude: -0.57918,
          accuracy: 10,
          altitude: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.MockedFunction<typeof Geolocation.getCurrentPosition>;
      mockGetCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await locationService.getCurrentLocation();
      expect(result).toEqual({
        latitude: 44.837789,
        longitude: -0.57918,
        city: 'Ville inconnue',
        address: null,
      });
    });
  });

  describe('refreshLocation', () => {
    it('should refresh location successfully', async () => {
      // Mock des permissions
      const mockCheck = PermissionsAndroid.check as jest.MockedFunction<typeof PermissionsAndroid.check>;
      mockCheck.mockResolvedValue(true);

      const mockPosition = {
        coords: {
          latitude: 44.837789,
          longitude: -0.57918,
          accuracy: 10,
          altitude: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.MockedFunction<typeof Geolocation.getCurrentPosition>;
      mockGetCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ 
          address: { 
            city: 'Bordeaux',
            town: null,
            village: null,
            county: null
          } 
        }),
      } as Response);

      const result = await locationService.refreshLocation();

      expect(result).toEqual({
        latitude: 44.837789,
        longitude: -0.57918,
        city: 'Bordeaux',
        address: null,
      });
    });
  });

  describe('hasLocation', () => {
    it('should return false when no location is set', () => {
      expect(locationService.hasLocation()).toBe(false);
    });

    it('should return true when location is set', () => {
      (locationService as any).currentLocation = {
        latitude: 44.837789,
        longitude: -0.57918,
        city: 'Bordeaux',
        address: null,
      };

      expect(locationService.hasLocation()).toBe(true);
    });
  });

  describe('getLocation', () => {
    it('should return current location data', () => {
      const mockLocation = {
        latitude: 44.837789,
        longitude: -0.57918,
        city: 'Bordeaux',
        address: null,
      };

      (locationService as any).currentLocation = mockLocation;

      const result = locationService.getLocation();
      expect(result).toEqual(mockLocation);
    });

    it('should return null when no location is set', () => {
      const result = locationService.getLocation();
      expect(result).toBeNull();
    });
  });

  describe('getCity', () => {
    it('should return city name when location is set', () => {
      (locationService as any).currentLocation = {
        latitude: 44.837789,
        longitude: -0.57918,
        city: 'Bordeaux',
        address: null,
      };

      const result = locationService.getCity();
      expect(result).toBe('Bordeaux');
    });

    it('should return empty string when no location is set', () => {
      const result = locationService.getCity();
      expect(result).toBe('');
    });
  });
});
