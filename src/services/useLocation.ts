import { useState, useEffect, useCallback } from 'react';
import locationService, { LocationData, LocationServiceCallbacks } from './locationService';

export interface UseLocationReturn {
  city: string;
  location: LocationData | null;
  isLoading: boolean;
  hasLocation: boolean;
  getCurrentLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export const useLocation = (callbacks?: LocationServiceCallbacks): UseLocationReturn => {
  const [city, setCity] = useState<string>('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configurer les callbacks du service
  useEffect(() => {
    if (callbacks) {
      locationService.setCallbacks({
        onLocationUpdate: (locationData) => {
          setLocation(locationData);
          setCity(locationData.city);
          callbacks.onLocationUpdate?.(locationData);
        },
        onCityUpdate: (cityName) => {
          setCity(cityName);
          callbacks.onCityUpdate?.(cityName);
        },
        onError: (error) => {
          callbacks.onError?.(error);
        },
        onPermissionDenied: () => {
          callbacks.onPermissionDenied?.();
        },
      });
    }

    // Nettoyer les callbacks au démontage
    return () => {
      locationService.clearCallbacks();
    };
  }, [callbacks]);

  // Récupérer la localisation actuelle
  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      const locationData = await locationService.getCurrentLocation();
      if (locationData) {
        setLocation(locationData);
        setCity(locationData.city);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualiser la localisation
  const refreshLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      const locationData = await locationService.refreshLocation();
      if (locationData) {
        setLocation(locationData);
        setCity(locationData.city);
      }
    } catch (error) {
      console.error('Erreur lors de l\'actualisation de la localisation:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialiser avec la localisation existante si disponible
  useEffect(() => {
    const currentLocation = locationService.getLocation();
    const currentCity = locationService.getCity();
    
    if (currentLocation) {
      setLocation(currentLocation);
      setCity(currentCity);
    }
  }, []);

  return {
    city,
    location,
    isLoading,
    hasLocation: locationService.hasLocation(),
    getCurrentLocation,
    refreshLocation,
  };
};
