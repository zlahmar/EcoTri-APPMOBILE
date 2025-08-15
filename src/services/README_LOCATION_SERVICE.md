# 📍 Service de Géolocalisation - EcoTri

## 🎯 Vue d'ensemble

Maintenant on a un **VRAI service** ! 🎉

- **Singleton** : Une seule instance partout dans l'app
- **Cache intelligent** : Évite les requêtes GPS inutiles
- **Callbacks** : Notifications automatiques des changements
- **Hook React** : `useLocation` pour une intégration facile

## 🏗️ Architecture

```
LocationService (Singleton)
├── Gestion des permissions
├── Récupération GPS
├── Conversion coordonnées → ville
├── Cache et gestion d'état
└── Callbacks pour notifications

useLocation (Hook React)
├── Interface avec LocationService
├── États React (city, location, isLoading)
└── Gestion du cycle de vie
```

## 🚀 Utilisation

### 1. **Hook React (Recommandé)**

```typescript
import { useLocation } from '../../services';

const MonEcran = () => {
  const { city, location, isLoading, getCurrentLocation } = useLocation({
    onError: error => console.error('Erreur:', error),
    onPermissionDenied: () => console.log('Permission refusée'),
  });

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <View>
      <Text>Ville: {city}</Text>
      <Text>Chargement: {isLoading ? 'Oui' : 'Non'}</Text>
    </View>
  );
};
```

### 2. **Service direct (Pour logique métier)**

```typescript
import locationService from '../../services/locationService';

// Dans une fonction ou un autre service
const getLocationForUser = async () => {
  const location = await locationService.getCurrentLocation();
  if (location) {
    console.log('Ville:', location.city);
    return location;
  }
  return null;
};
```

## 📱 Propriétés du Hook

### **Valeurs retournées :**

- **`city`** : Nom de la ville actuelle
- **`location`** : Données complètes de localisation
- **`isLoading`** : État de chargement
- **`hasLocation`** : Si on a déjà une localisation
- **`getCurrentLocation()`** : Récupérer la localisation
- **`refreshLocation()`** : Actualiser la localisation

### **Callbacks disponibles :**

- **`onLocationUpdate`** : Quand la localisation change
- **`onCityUpdate`** : Quand la ville change
- **`onError`** : En cas d'erreur
- **`onPermissionDenied`** : Si permission refusée

## 🔧 Méthodes du Service

### **LocationService.getInstance()**

```typescript
// Obtenir l'instance unique
const locationService = LocationService.getInstance();

// Ou utiliser l'export direct
import locationService from '../../services/locationService';
```

### **Méthodes principales :**

```typescript
// Vérifier la permission
const hasPermission = await locationService.checkPermission();

// Demander la permission
const granted = await locationService.requestPermission();

// Récupérer la localisation
const location = await locationService.getCurrentLocation();

// Actualiser
const newLocation = await locationService.refreshLocation();

// Obtenir depuis le cache
const cachedLocation = locationService.getLocation();
const cachedCity = locationService.getCity();

// Vérifier si on a une localisation
const hasLocation = locationService.hasLocation();
```

## 💡 Exemples d'utilisation

### **1. Écran simple avec localisation**

```typescript
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLocation } from '../../services';
import { LocationDisplay } from '../../components/common';

const MonEcran = () => {
  const { city, isLoading, getCurrentLocation } = useLocation();

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <View>
      <Text>Bienvenue dans votre ville :</Text>
      <LocationDisplay city={city} isLoading={isLoading} />
    </View>
  );
};
```

### **2. Avec gestion d'erreurs complète**

```typescript
const { city, isLoading, getCurrentLocation } = useLocation({
  onLocationUpdate: location => {
    console.log('Nouvelle localisation:', location);
    // Sauvegarder en base, etc.
  },
  onCityUpdate: cityName => {
    console.log('Nouvelle ville:', cityName);
    // Mettre à jour l'UI, etc.
  },
  onError: error => {
    Alert.alert('Erreur de localisation', error);
  },
  onPermissionDenied: () => {
    Alert.alert(
      'Permission requise',
      "Veuillez autoriser l'accès à la localisation.",
    );
  },
});
```

### **3. Service métier utilisant la localisation**

```typescript
import locationService from '../../services/locationService';

class UserPreferencesService {
  async updateUserLocation() {
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        // Sauvegarder en base
        await this.saveUserLocation(location);
        return location;
      }
    } catch (error) {
      console.error('Erreur mise à jour localisation:', error);
    }
  }

  async getNearbyServices() {
    const location = locationService.getLocation();
    if (location) {
      // Utiliser la localisation pour chercher des services proches
      return await this.searchNearbyServices(
        location.latitude,
        location.longitude,
      );
    }
    return [];
  }
}
```

## ⚡ Avantages de cette approche

### **✅ Avantages :**

1. **Singleton** : Une seule instance, pas de duplication
2. **Cache intelligent** : Évite les requêtes GPS inutiles
3. **Callbacks** : Notifications automatiques des changements
4. **Hook React** : Intégration facile avec les composants
5. **Service direct** : Utilisable partout (pas seulement dans React)
6. **Gestion d'état** : Évite les boucles infinies
7. **Performance** : `maximumAge: 60000` (cache 1 minute)

### **🔧 Cas d'usage :**

- **Écrans** : Utiliser le hook `useLocation`
- **Services** : Utiliser directement `locationService`
- **Logique métier** : Appeler les méthodes du service
- **Cache** : Récupérer la localisation sans nouvelle requête GPS

## 🚨 Gestion des erreurs

Le service gère automatiquement :

- ✅ Permissions refusées
- ✅ GPS indisponible
- ✅ Timeout de localisation
- ✅ Erreurs réseau
- ✅ Erreurs de conversion d'adresse

## 📊 Performance

- **Cache** : 1 minute maximum
- **Précision** : Haute précision activée
- **Timeout** : 15 secondes maximum
- **Optimisation** : Une seule requête GPS par actualisation
- **Singleton** : Pas de re-création d'instances

## 🔄 Cycle de vie

1. **Première utilisation** : Demande permission → GPS → Ville
2. **Utilisations suivantes** : Retourne depuis le cache
3. **Actualisation** : Force nouvelle requête GPS
4. **Nettoyage** : Callbacks automatiquement nettoyés

## 🎯 Résumé

Maintenant vous avez le **meilleur des deux mondes** :

- **Service robuste** : Singleton, cache, gestion d'erreurs
- **Hook React simple** : `useLocation()` facile à utiliser
- **Performance** : Pas de boucles, pas de re-renders
- **Flexibilité** : Utilisable partout dans l'app

**C'est un VRAI service maintenant !** 🚀
