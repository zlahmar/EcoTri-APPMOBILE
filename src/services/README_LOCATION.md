# 📍 Service de Géolocalisation - EcoTri

## 🎯 Vue d'ensemble

Le service `useLocationService` fournit une interface unifiée pour gérer la géolocalisation dans l'application EcoTri. Il gère automatiquement les permissions, la récupération de la position GPS et la conversion des coordonnées en nom de ville.

## 🚀 Utilisation de base

### 1. Import du service

```typescript
import { useLocationService } from '../../services';
```

### 2. Utilisation dans un composant

```typescript
const MyComponent = () => {
  const { 
    city, 
    location, 
    isLoading, 
    permission, 
    getCurrentLocation, 
    refreshLocation 
  } = useLocationService({
    autoStart: true, // Démarrer automatiquement
    onLocationUpdate: (locationData) => {
      console.log('Nouvelle localisation:', locationData);
    },
    onError: (error) => {
      console.error('Erreur de localisation:', error);
    },
    onPermissionDenied: () => {
      console.log('Permission refusée');
    }
  });

  return (
    <View>
      <Text>Ville: {city}</Text>
      <Text>Chargement: {isLoading ? 'Oui' : 'Non'}</Text>
      <Text>Permission: {permission}</Text>
    </View>
  );
};
```

## 📱 Propriétés du service

### Props d'entrée (`LocationServiceProps`)

- **`autoStart`** (boolean, défaut: `true`) : Démarrer automatiquement la géolocalisation
- **`onLocationUpdate`** (callback) : Appelé quand la localisation change
- **`onPermissionDenied`** (callback) : Appelé si la permission est refusée
- **`onError`** (callback) : Appelé en cas d'erreur

### Valeurs de retour (`LocationServiceReturn`)

- **`city`** (string) : Nom de la ville actuelle
- **`location`** (LocationData | null) : Données complètes de localisation
- **`isLoading`** (boolean) : État de chargement
- **`permission`** ('granted' | 'denied' | 'checking') : État des permissions
- **`getCurrentLocation`** (function) : Fonction pour récupérer la localisation
- **`refreshLocation`** (function) : Fonction pour actualiser la localisation

## 🏗️ Structure des données

### Interface `LocationData`

```typescript
interface LocationData {
  latitude: number;    // Latitude GPS
  longitude: number;   // Longitude GPS
  city: string;        // Nom de la ville
  address?: any;       // Adresse complète (OpenStreetMap)
}
```

## 💡 Exemples d'utilisation

### 1. Affichage simple de la ville

```typescript
const { city, isLoading } = useLocationService();

return (
  <View>
    <Text>
      {isLoading ? '📍 Localisation...' : `📍 ${city}`}
    </Text>
  </View>
);
```

### 2. Avec gestion d'erreurs

```typescript
const { city, isLoading, permission } = useLocationService({
  onError: (error) => {
    Alert.alert('Erreur de localisation', error);
  },
  onPermissionDenied: () => {
    Alert.alert(
      'Permission requise',
      'Veuillez autoriser l\'accès à la localisation dans les paramètres.'
    );
  }
});
```

### 3. Contrôle manuel

```typescript
const { city, getCurrentLocation, refreshLocation } = useLocationService({
  autoStart: false // Ne pas démarrer automatiquement
});

const handleLocationRequest = () => {
  getCurrentLocation();
};

const handleRefresh = () => {
  refreshLocation();
};
```

## 🔧 Composant LocationDisplay

Pour un affichage standardisé de la localisation, utilisez le composant `LocationDisplay` :

```typescript
import { LocationDisplay } from '../../components/common';

// Utilisation basique
<LocationDisplay city={city} isLoading={isLoading} />

// Avec bouton de rafraîchissement
<LocationDisplay 
  city={city} 
  isLoading={isLoading}
  showRefreshButton={true}
  onRefresh={refreshLocation}
  size="large"
/>

// Tailles disponibles
<LocationDisplay city={city} size="small" />   // 12px
<LocationDisplay city={city} size="medium" />  // 14px (défaut)
<LocationDisplay city={city} size="large" />   // 16px
```

## 🌍 API utilisée

Le service utilise l'API **OpenStreetMap Nominatim** pour convertir les coordonnées GPS en nom de ville :

- **Endpoint** : `https://nominatim.openstreetmap.org/reverse`
- **Format** : JSON
- **Langue** : Français (`accept-language=fr`)
- **Zoom** : 10 (niveau de détail de la ville)

## ⚠️ Permissions requises

### Android
- `ACCESS_FINE_LOCATION` : Accès précis à la localisation

### iOS
- `NSLocationWhenInUseUsageDescription` : Description d'utilisation dans Info.plist

## 🚨 Gestion des erreurs

Le service gère automatiquement :
- ✅ Permissions refusées
- ✅ GPS indisponible
- ✅ Timeout de localisation
- ✅ Erreurs réseau
- ✅ Erreurs de conversion d'adresse

## 📱 Compatibilité

- ✅ React Native 0.60+
- ✅ Android 6.0+ (API 23+)
- ✅ iOS 9.0+
- ✅ Expo (avec éject)

## 🔄 Actualisation

Le service peut être actualisé de deux façons :

1. **Automatique** : `autoStart: true` (défaut)
2. **Manuel** : Appel de `refreshLocation()` ou `getCurrentLocation()`

## 📊 Performance

- **Cache** : 10 secondes maximum
- **Précision** : Haute précision activée
- **Timeout** : 15 secondes maximum
- **Optimisation** : Une seule requête GPS par actualisation
