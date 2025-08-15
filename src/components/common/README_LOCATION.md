# 📍 Utilisation de la Géolocalisation - EcoTri

## 🎯 Vue d'ensemble

Ce document explique comment implémenter la géolocalisation dans vos écrans en utilisant la même approche que le HomeScreen et ProfileScreen.

## 🚀 Implémentation de base

### 1. Imports nécessaires

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
```

### 2. États requis

```typescript
const [userCity, setUserCity] = useState<string>('');
const [locationLoading, setLocationLoading] = useState(false);
```

### 3. Fonction de récupération de la ville

```typescript
const fetchCityFromCoordinates = useCallback(async (lat: number, lon: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=fr`;
    const response = await fetch(url, {
      headers: { "User-Agent": "EcoTri/1.0" },
    });
    const data = await response.json();
    
    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Ville inconnue';
      setUserCity(city);
      console.log('📍 Ville détectée:', city);
    } else {
      setUserCity('Ville inconnue');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la ville:', error);
    setUserCity('Ville inconnue');
  }
}, []);
```

### 4. Fonction de géolocalisation

```typescript
const getCurrentLocation = useCallback(() => {
  setLocationLoading(true);
  
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('📍 Position obtenue:', latitude, longitude);
      
      // Récupérer le nom de la ville
      fetchCityFromCoordinates(latitude, longitude);
      setLocationLoading(false);
    },
    (error) => {
      console.error('Erreur de géolocalisation:', error);
      setUserCity('Localisation impossible');
      setLocationLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    }
  );
}, [fetchCityFromCoordinates]);
```

### 5. Demande de permission

```typescript
const requestLocationPermission = useCallback(async () => {
  try {
    if (Platform.OS === 'android') {
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
      
      if (granted === 'granted') {
        console.log('📍 Permission accordée, récupération de la localisation...');
        getCurrentLocation();
      } else {
        setUserCity('Permission refusée');
      }
    } else {
      // iOS
      Geolocation.requestAuthorization('whenInUse');
      getCurrentLocation();
    }
  } catch (err) {
    console.error('Erreur de permission:', err);
    setUserCity('Erreur de permission');
  }
}, [getCurrentLocation]);
```

### 6. Déclenchement initial

```typescript
useEffect(() => {
  // Appeler quand le composant se monte ou quand l'utilisateur se connecte
  requestLocationPermission();
}, [requestLocationPermission]);
```

## 🔧 Utilisation du composant LocationDisplay

```typescript
import { LocationDisplay } from '../../components/common';

// Dans votre JSX
<LocationDisplay 
  city={userCity} 
  isLoading={locationLoading}
  size="small" // ou "medium" ou "large"
/>
```

## 📱 Exemple complet

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationDisplay } from '../../components/common';

const MonEcran = () => {
  const [userCity, setUserCity] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchCityFromCoordinates = useCallback(async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=fr`;
      const response = await fetch(url, {
        headers: { "User-Agent": "EcoTri/1.0" },
      });
      const data = await response.json();
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Ville inconnue';
        setUserCity(city);
      } else {
        setUserCity('Ville inconnue');
      }
    } catch (error) {
      setUserCity('Ville inconnue');
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    setLocationLoading(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCityFromCoordinates(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        setUserCity('Localisation impossible');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, [fetchCityFromCoordinates]);

  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'EcoTri a besoin d\'accéder à votre position.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === 'granted') {
          getCurrentLocation();
        } else {
          setUserCity('Permission refusée');
        }
      } else {
        Geolocation.requestAuthorization('whenInUse');
        getCurrentLocation();
      }
    } catch (err) {
      setUserCity('Erreur de permission');
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  return (
    <View>
      <Text>Votre ville :</Text>
      <LocationDisplay 
        city={userCity} 
        isLoading={locationLoading}
        size="medium"
      />
    </View>
  );
};

export default MonEcran;
```

## ⚠️ Points importants

1. **Pas de boucles infinies** : Utilisez `useCallback` pour éviter les re-créations de fonctions
2. **Gestion des erreurs** : Toujours gérer les cas d'erreur et de permission refusée
3. **Performance** : Utilisez `maximumAge: 60000` pour éviter trop de requêtes GPS
4. **User-Agent** : Incluez un User-Agent dans vos requêtes Nominatim

## 🔄 Actualisation manuelle

Si vous voulez permettre à l'utilisateur de rafraîchir sa localisation :

```typescript
const handleRefreshLocation = () => {
  requestLocationPermission();
};

// Dans le composant LocationDisplay
<LocationDisplay 
  city={userCity} 
  isLoading={locationLoading}
  showRefreshButton={true}
  onRefresh={handleRefreshLocation}
  size="medium"
/>
```
