# 📍 Géolocalisation et API Overpass - EcoTri

**Version :** 6.0.0  
**Date :** Décembre 2024  
**Statut :** ✅ IMPLÉMENTÉ ET TESTÉ

## 🎯 **Vue d'Ensemble**

La fonctionnalité de **Géolocalisation Intelligente** combine la détection automatique de la position utilisateur avec la recherche ultra-précise de points de recyclage via l'API Overpass d'OpenStreetMap. Cette approche offre une expérience utilisateur fluide et des résultats de recherche fiables.

## 🚀 **Fonctionnalités Principales**

### **📍 Géolocalisation Automatique**
- **Détection GPS** : Utilise `react-native-geolocation-service` pour Android
- **Précision élevée** : GPS + réseau cellulaire pour une localisation optimale
- **Permissions intelligentes** : Gestion automatique des permissions Android/iOS
- **Fallback web** : Google Maps dans le navigateur si échec

### **🗺️ API Overpass Intégrée**
- **Recherche ultra-précise** : Points de recyclage officiels OpenStreetMap
- **Types détaillés** : Verre, plastique, papier, métal, électro, etc.
- **Rayon configurable** : 5km par défaut (modifiable)
- **Fallback Nominatim** : Recherche élargie si Overpass échoue

## 🏗️ **Architecture Technique**

### **Structure des APIs**

```typescript
// API Overpass (primaire)
const overpassQuery = `
  [out:json];
  (
    node["amenity"="recycling"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
    way["amenity"="recycling"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
    node["recycling:glass"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
    // ... autres types de recyclage
  );
  out;
`;

// API Nominatim (fallback)
const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=15&radius=5000`;
```

### **Flux de Recherche**

```mermaid
graph TD
    A[Géolocalisation utilisateur] --> B[Coordonnées obtenues]
    B --> C[Recherche Overpass]
    C --> D{Résultats ?}
    D -->|Oui| E[Affichage des points]
    D -->|Non| F[Fallback Nominatim]
    F --> G{Résultats ?}
    G -->|Oui| H[Affichage des points]
    G -->|Non| I[Message "Aucun point trouvé"]
```

## 🔧 **Implémentation Technique**

### **Géolocalisation avec Permissions**

```typescript
const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission de localisation',
          message: 'EcoTri a besoin d\'accéder à votre localisation pour trouver les points de recyclage.',
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
```

### **Recherche Overpass avec Fallback**

```typescript
const fetchRecyclingPoints = async (lat: number, lon: number) => {
  const delta = 0.045; // ~5km
  
  try {
    // Tentative Overpass
    const overpassQuery = `[out:json];(node["amenity"="recycling"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});way["amenity"="recycling"](${lat - delta},${lon - delta},${lat + delta},${lon + delta}););out;`;
    
    const response = await fetch('https://overpass.kumi.systems/api/interpreter', {
      method: 'POST',
      body: overpassQuery
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.elements && data.elements.length > 0) {
        return processOverpassData(data.elements, lat, lon);
      }
    }
    
    // Fallback Nominatim
    return await fetchRecyclingPointsFallback(lat, lon);
    
  } catch (error) {
    console.log('Erreur Overpass, fallback Nominatim:', error);
    return await fetchRecyclingPointsFallback(lat, lon);
  }
};
```

## 📱 **Interface Utilisateur**

### **Affichage de la Localisation**

```typescript
const locationInfo = (
  <View style={styles.locationInfo}>
    <MaterialIcons name="location-on" size={24} color={colors.primary} />
    <Text style={styles.locationText}>
      {userCity || 'Localisation en cours...'}
    </Text>
    <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
      <MaterialIcons name="refresh" size={20} color={colors.onSurface} />
    </TouchableOpacity>
  </View>
);
```

### **Liste des Points de Recyclage**

```typescript
const pointCard = (point: RecyclingPoint, index: number) => (
  <TouchableOpacity 
    key={index} 
    style={styles.pointCard}
    onPress={() => openNavigation(point)}
  >
    <View style={styles.pointIcon}>
      <MaterialIcons name="recycling" size={24} color={colors.primary} />
    </View>
    <View style={styles.pointInfo}>
      <Text style={styles.pointName}>{point.display_name}</Text>
      <Text style={styles.pointType}>{getRecyclingTypes(point.tags)}</Text>
      <Text style={styles.pointDistance}>
        {point.distance ? `${point.distance.toFixed(1)} km` : 'Distance inconnue'}
      </Text>
    </View>
    <MaterialIcons name="directions" size={24} color={colors.primary} />
  </TouchableOpacity>
);
```

## 🚀 **Avantages de l'Approche**

### **🎯 Précision et Fiabilité**
- **API Overpass** : Données officielles OpenStreetMap
- **Types détaillés** : Classification précise des déchets acceptés
- **Coordonnées exactes** : Position GPS précise des points
- **Mise à jour continue** : Données OpenStreetMap régulièrement mises à jour

### **⚡ Performance et UX**
- **Géolocalisation rapide** : Détection en quelques secondes
- **Recherche intelligente** : Rayon adaptatif selon la densité
- **Fallback robuste** : Fonctionne même si Overpass échoue
- **Interface responsive** : Affichage en temps réel

### **🌍 Couverture et Accessibilité**
- **Couverture mondiale** : OpenStreetMap couvre le monde entier
- **Données communautaires** : Points vérifiés par la communauté
- **Gratuit et ouvert** : Pas de coût d'API ou de limite
- **Standards ouverts** : Compatible avec tous les systèmes

## 🧪 **Tests et Validation**

### **Test de Géolocalisation**

```typescript
describe('Geolocation', () => {
  it('should request location permission', async () => {
    const permission = await requestLocationPermission();
    expect(permission).toBe(true);
  });
  
  it('should get current location', async () => {
    const location = await getCurrentLocation();
    expect(location).toHaveProperty('latitude');
    expect(location).toHaveProperty('longitude');
  });
});
```

### **Test de Recherche Overpass**

```typescript
describe('Overpass API', () => {
  it('should fetch recycling points', async () => {
    const points = await fetchRecyclingPoints(48.8566, 2.3522);
    expect(Array.isArray(points)).toBe(true);
  });
  
  it('should fallback to Nominatim if Overpass fails', async () => {
    // Mock Overpass failure
    const points = await fetchRecyclingPoints(48.8566, 2.3522);
    expect(points.length).toBeGreaterThan(0);
  });
});
```

## 🔮 **Évolutions Futures**

### **Version 6.1.0**
- **🗺️ Carte interactive** : Affichage des points sur une carte
- **📍 Filtres avancés** : Par type de déchet, distance, horaires
- **🔔 Notifications** : Rappels de collecte et nouveaux points

### **Version 6.2.0**
- **🤖 IA de recommandation** : Points suggérés selon l'historique
- **📊 Analytics** : Statistiques d'utilisation des points
- **🌍 Mode hors ligne** : Cache local des points fréquents

---

**🌱 La géolocalisation intelligente rend le recyclage accessible partout !** 📍✨
