import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  address?: any;
}

export interface LocationServiceCallbacks {
  onLocationUpdate?: (location: LocationData) => void;
  onCityUpdate?: (city: string) => void;
  onError?: (error: string) => void;
  onPermissionDenied?: () => void;
}

class LocationService {
  private static instance: LocationService;
  private callbacks: LocationServiceCallbacks = {};
  private currentLocation: LocationData | null = null;
  private isRequestingLocation = false;

  // Singleton pattern
  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Définir les callbacks
  public setCallbacks(callbacks: LocationServiceCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Vérifier si la permission est accordée
  public async checkPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted;
      } catch (error) {
        console.error('Erreur lors de la vérification de permission:', error);
        return false;
      }
    }
    // iOS - on suppose que c'est accordé pour l'instant
    return true;
  }

  // Demander la permission
  public async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'EcoTri a besoin d\'accéder à votre position pour afficher votre ville.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('📍 Permission accordée');
          return true;
        } else {
          console.log('📍 Permission refusée');
          this.callbacks.onPermissionDenied?.();
          return false;
        }
      } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
        this.callbacks.onError?.('Erreur lors de la demande de permission');
        return false;
      }
    } else {
      // iOS
      try {
        await Geolocation.requestAuthorization('whenInUse');
        return true;
      } catch (error) {
        console.error('Erreur iOS permission:', error);
        return false;
      }
    }
  }

  // Récupérer la localisation actuelle
  public async getCurrentLocation(): Promise<LocationData | null> {
    // Si on est déjà en train de récupérer, ne pas relancer
    if (this.isRequestingLocation) {
      console.log('📍 Localisation déjà en cours...');
      return this.currentLocation;
    }

    // Vérifier la permission d'abord
    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        return null;
      }
    }

    this.isRequestingLocation = true;

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.isRequestingLocation = false;
        this.callbacks.onError?.('Timeout de localisation');
        resolve(null);
      }, 15000);

      Geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeout);
          this.isRequestingLocation = false;
          
          const { latitude, longitude } = position.coords;
          console.log('📍 Position obtenue:', latitude, longitude);
          
          // Récupérer le nom de la ville
          const city = await this.fetchCityFromCoordinates(latitude, longitude);
          
          const locationData: LocationData = {
            latitude,
            longitude,
            city,
            address: null, // On pourrait l'ajouter si nécessaire
          };
          
          this.currentLocation = locationData;
          this.callbacks.onLocationUpdate?.(locationData);
          this.callbacks.onCityUpdate?.(city);
          
          resolve(locationData);
        },
        (error) => {
          clearTimeout(timeout);
          this.isRequestingLocation = false;
          
          console.error('Erreur de géolocalisation:', error);
          let errorMessage = 'Localisation impossible';
          
          switch (error.code) {
            case 1:
              errorMessage = 'Permission refusée';
              break;
            case 2:
              errorMessage = 'Position indisponible';
              break;
            case 3:
              errorMessage = 'Délai d\'attente dépassé';
              break;
            default:
              errorMessage = 'Erreur de localisation';
          }
          
          this.callbacks.onError?.(errorMessage);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000, // Cache de 1 minute
        }
      );
    });
  }

  // Récupérer le nom de la ville via OpenStreetMap
  private async fetchCityFromCoordinates(lat: number, lon: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=fr`;
      const response = await fetch(url, {
        headers: { "User-Agent": "EcoTri/1.0" },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'adresse');
      }
      
      const data = await response.json();
      let cityName = 'Ville inconnue';
      
      if (data.address) {
        cityName = data.address.city || 
                  data.address.town || 
                  data.address.village || 
                  data.address.county || 
                  'Ville inconnue';
      }
      
      console.log('📍 Ville détectée:', cityName);
      return cityName;
      
    } catch (error) {
      console.error('Erreur lors de la récupération de la ville:', error);
      return 'Ville inconnue';
    }
  }

  // Actualiser la localisation
  public async refreshLocation(): Promise<LocationData | null> {
    console.log('📍 Actualisation de la localisation...');
    return this.getCurrentLocation();
  }

  // Obtenir la localisation actuelle (depuis le cache si disponible)
  public getLocation(): LocationData | null {
    return this.currentLocation;
  }

  // Obtenir la ville actuelle
  public getCity(): string {
    return this.currentLocation?.city || '';
  }

  // Vérifier si on a une localisation
  public hasLocation(): boolean {
    return this.currentLocation !== null;
  }

  // Nettoyer les callbacks
  public clearCallbacks(): void {
    this.callbacks = {};
  }
}

// Export d'une instance unique
export default LocationService.getInstance();
