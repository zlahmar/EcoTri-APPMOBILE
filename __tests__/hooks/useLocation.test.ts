// Mock complet de locationService avant l'import
jest.mock('../../src/services/locationService', () => ({
  __esModule: true,
  default: {
    setCallbacks: jest.fn(),
    clearCallbacks: jest.fn(),
    getCurrentLocation: jest.fn(),
    refreshLocation: jest.fn(),
    getLocation: jest.fn(),
    getCity: jest.fn(),
    hasLocation: jest.fn(),
  },
}));

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useLocation } from '../../src/services/useLocation';
import locationService from '../../src/services/locationService';

const mockLocationService = locationService as jest.Mocked<typeof locationService>;

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset des mocks du service
    mockLocationService.setCallbacks.mockClear();
    mockLocationService.clearCallbacks.mockClear();
    mockLocationService.getCurrentLocation.mockClear();
    mockLocationService.refreshLocation.mockClear();
    mockLocationService.getLocation.mockClear();
    mockLocationService.getCity.mockClear();
    mockLocationService.hasLocation.mockClear();
  });

  it('should return correct interface structure', () => {
    // Mock des méthodes du service
    mockLocationService.getLocation.mockReturnValue(null);
    mockLocationService.getCity.mockReturnValue('');
    mockLocationService.hasLocation.mockReturnValue(false);

    const { result } = renderHook(() => useLocation());

    expect(result.current).toHaveProperty('city');
    expect(result.current).toHaveProperty('location');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('hasLocation');
    expect(result.current).toHaveProperty('getCurrentLocation');
    expect(result.current).toHaveProperty('refreshLocation');
  });

  it('should return initial state', () => {
    // Mock des méthodes du service
    mockLocationService.getLocation.mockReturnValue(null);
    mockLocationService.getCity.mockReturnValue('');
    mockLocationService.hasLocation.mockReturnValue(false);

    const { result } = renderHook(() => useLocation());

    expect(result.current.city).toBe('');
    expect(result.current.location).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.getCurrentLocation).toBe('function');
    expect(typeof result.current.refreshLocation).toBe('function');
    expect(typeof result.current.hasLocation).toBe('boolean');
  });

  it('should set callbacks when provided', () => {
    const mockCallbacks = {
      onLocationUpdate: jest.fn(),
      onError: jest.fn(),
      onPermissionDenied: jest.fn(),
      onCityUpdate: jest.fn(),
    };

    renderHook(() => useLocation(mockCallbacks));

    expect(mockLocationService.setCallbacks).toHaveBeenCalled();
  });

  it('should initialize with existing location data', () => {
    const mockLocationData = {
      latitude: 44.837789,
      longitude: -0.57918,
      city: 'Bordeaux',
      address: 'Bordeaux, France',
    };

    mockLocationService.getLocation.mockReturnValue(mockLocationData);
    mockLocationService.getCity.mockReturnValue('Bordeaux');
    mockLocationService.hasLocation.mockReturnValue(true);

    const { result } = renderHook(() => useLocation());

    expect(result.current.location).toEqual(mockLocationData);
    expect(result.current.city).toBe('Bordeaux');
    expect(result.current.hasLocation).toBe(true);
  });

  it('should handle empty city from location service', () => {
    mockLocationService.getLocation.mockReturnValue(null);
    mockLocationService.getCity.mockReturnValue('');
    mockLocationService.hasLocation.mockReturnValue(false);

    const { result } = renderHook(() => useLocation());

    expect(result.current.city).toBe('');
    expect(result.current.location).toBeNull();
    expect(result.current.hasLocation).toBe(false);
  });

  it('should have async methods', () => {
    const { result } = renderHook(() => useLocation());

    expect(typeof result.current.getCurrentLocation).toBe('function');
    expect(typeof result.current.refreshLocation).toBe('function');
  });

  it('should handle location service integration', async () => {
    const mockLocationData = {
      latitude: 44.837789,
      longitude: -0.57918,
      city: 'Bordeaux',
      address: 'Bordeaux, France',
    };

    mockLocationService.getCurrentLocation.mockResolvedValue(mockLocationData);

    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.getCurrentLocation();
    });
    
    expect(mockLocationService.getCurrentLocation).toHaveBeenCalled();
  });

  it('should handle refresh location integration', async () => {
    const mockLocationData = {
      latitude: 44.837789,
      longitude: -0.57918,
      city: 'Bordeaux',
      address: 'Bordeaux, France',
    };

    mockLocationService.refreshLocation.mockResolvedValue(mockLocationData);

    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.refreshLocation();
    });
    
    expect(mockLocationService.refreshLocation).toHaveBeenCalled();
  });

  it('should check location existence', () => {
    mockLocationService.hasLocation.mockReturnValue(true);

    const { result } = renderHook(() => useLocation());

    expect(result.current.hasLocation).toBe(true);
    expect(mockLocationService.hasLocation).toHaveBeenCalled();
  });

  it('should handle callback cleanup', () => {
    const mockCallbacks = {
      onLocationUpdate: jest.fn(),
      onError: jest.fn(),
      onPermissionDenied: jest.fn(),
      onCityUpdate: jest.fn(),
    };

    renderHook(() => useLocation(mockCallbacks));

    expect(mockLocationService.setCallbacks).toHaveBeenCalled();
  });

  it('should handle multiple hook calls', () => {
    const { result: result1 } = renderHook(() => useLocation());
    expect(result1.current).toBeDefined();
    
    const { result: result2 } = renderHook(() => useLocation());
    expect(result2.current).toBeDefined();
    
    expect(typeof result1.current.city).toBe('string');
    expect(typeof result2.current.city).toBe('string');
  });
});
