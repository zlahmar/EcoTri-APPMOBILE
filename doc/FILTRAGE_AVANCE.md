# 🔍 **Système de Filtrage Avancé et Sélection de Rayon Dynamique**

**Version :** 7.0.0  
**Dernière mise à jour :** Décembre 2024

## 🎯 **Vue d'Ensemble**

Le système de filtrage avancé d'EcoTri permet aux utilisateurs de trouver rapidement les points de recyclage spécifiques à leurs besoins, tandis que la sélection de rayon dynamique offre un contrôle précis sur la zone de recherche géographique.

## 🔍 **Système de Filtrage Avancé**

### **Types de Filtres Disponibles**

#### **🍷 Filtre Verre**
- **Mots-clés** : `verre`, `bouteille`, `bouteilles`, `glass`, `bouteilles en verre`, `contenants en verre`
- **Icône** : `wine-bar` (MaterialIcons)
- **Couleur** : `colors.success` (vert)
- **Description** : Points de recyclage pour tous types de verre

#### **🥤 Filtre Plastique**
- **Mots-clés** : `plastique`, `plastic`, `bouteilles en plastique`, `emballages plastique`
- **Icône** : `local-drink` (MaterialIcons)
- **Couleur** : `colors.primary` (bleu principal)
- **Description** : Recyclage des matières plastiques

#### **📄 Filtre Papier**
- **Mots-clés** : `papier`, `paper`, `carton`, `cardboard`, `livres`, `magazines`, `journaux`
- **Icône** : `description` (MaterialIcons)
- **Couleur** : `colors.warning` (orange)
- **Description** : Papier, carton et publications

#### **🔩 Filtre Métal**
- **Mots-clés** : `métal`, `metal`, `aluminium`, `acier`, `steel`, `boîtes`, `canettes`
- **Icône** : `hardware` (MaterialIcons)
- **Couleur** : `colors.text` (gris foncé)
- **Description** : Métaux ferreux et non-ferreux

#### **📱 Filtre Électronique**
- **Mots-clés** : `électronique`, `electronics`, `électrique`, `appareils`, `téléphone`, `ordinateur`
- **Icône** : `devices` (MaterialIcons)
- **Couleur** : `colors.error` (rouge)
- **Description** : Appareils électroniques et électriques

#### **👕 Filtre Textile**
- **Mots-clés** : `textile`, `vêtements`, `clothes`, `chaussures`, `shoes`
- **Icône** : `checkroom` (MaterialIcons)
- **Couleur** : `colors.primary` (bleu)
- **Description** : Vêtements et chaussures

#### **🔋 Filtre Piles**
- **Mots-clés** : `piles`, `batteries`, `batterie`, `ampoules`, `light_bulbs`
- **Icône** : `battery-charging-full` (MaterialIcons)
- **Couleur** : `colors.warning` (orange)
- **Description** : Piles, batteries et ampoules

#### **🌱 Filtre Organique**
- **Mots-clés** : `organique`, `organic`, `compost`, `déchets verts`, `garden_waste`, `biodegradable`
- **Icône** : `eco` (MaterialIcons)
- **Couleur** : `colors.success` (vert)
- **Description** : Déchets organiques et biodégradables

### **Logique de Filtrage Intelligente**

#### **Algorithme de Recherche**
```typescript
const applyFilters = useCallback(() => {
  if (activeFilters.length === 0) {
    setFilteredPoints(recyclingPoints);
    return;
  }

  const filtered = recyclingPoints.filter(point => {
    const pointType = point.type.toLowerCase();
    const pointName = point.display_name.toLowerCase();
    
    return activeFilters.some(filter => {
      // 1. Recherche directe dans le type
      if (pointType.includes(filter)) return true;
      
      // 2. Recherche directe dans le nom
      if (pointName.includes(filter)) return true;
      
      // 3. Recherche avec mots-clés étendus
      const filterKeywords = getFilterKeywords(filter);
      return filterKeywords.some(keyword => 
        pointType.includes(keyword) || pointName.includes(keyword)
      );
    });
  });

  setFilteredPoints(filtered);
}, [activeFilters, recyclingPoints]);
```

#### **Système de Mots-clés Multiples**
```typescript
const getFilterKeywords = (filterKey: string): string[] => {
  const keywords: { [key: string]: string[] } = {
    'glass': ['verre', 'bouteille', 'bouteilles', 'glass', 'bouteilles en verre', 'contenants en verre'],
    'plastic': ['plastique', 'plastic', 'bouteilles en plastique', 'emballages plastique'],
    'paper': ['papier', 'paper', 'carton', 'cardboard', 'livres', 'magazines', 'journaux'],
    'metal': ['métal', 'metal', 'aluminium', 'acier', 'steel', 'boîtes', 'canettes'],
    'electronics': ['électronique', 'electronics', 'électrique', 'appareils', 'téléphone', 'ordinateur'],
    'textile': ['textile', 'vêtements', 'clothes', 'chaussures', 'shoes'],
    'batteries': ['piles', 'batteries', 'batterie', 'ampoules', 'light_bulbs'],
    'organic': ['organique', 'organic', 'compost', 'déchets verts', 'garden_waste', 'biodegradable']
  };
  
  return keywords[filterKey] || [filterKey];
};
```

### **Interface de Filtrage**

#### **Composants Visuels**
- **Boutons de filtre** : Design Material avec états actifs/inactifs
- **Scroll horizontal** : Navigation fluide entre tous les filtres
- **Bouton "Effacer"** : Apparition conditionnelle quand des filtres sont actifs
- **Icônes distinctes** : Chaque type de recyclage a sa propre icône

#### **États des Filtres**
```typescript
// État inactif
filterButton: {
  backgroundColor: colors.surface,
  borderColor: colors.border,
}

// État actif
filterButtonActive: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
}
```

#### **Gestion des Filtres Actifs**
```typescript
const toggleFilter = (filterKey: string) => {
  setActiveFilters(prev => {
    if (prev.includes(filterKey)) {
      return prev.filter(f => f !== filterKey);
    } else {
      return [...prev, filterKey];
    }
  });
};

const clearAllFilters = () => {
  setActiveFilters([]);
};
```

## 📏 **Sélection de Rayon Dynamique**

### **Rayons Disponibles**

| Rayon | Label | Description |
|-------|-------|-------------|
| 500m | `500m` | Zone très proche, points de quartier |
| 1000m | `1km` | Zone proche, points accessibles à pied |
| 2000m | `2km` | Zone intermédiaire, points accessibles en vélo |
| 5000m | `5km` | Zone large, points accessibles en voiture |
| 10000m | `10km` | Zone très large, points éloignés |

### **Interface de Sélection**

#### **Composant Dropdown**
```typescript
<View style={styles.radiusSelector}>
  <TouchableOpacity
    style={styles.radiusDropdown}
    onPress={() => setShowRadiusMenu(!showRadiusMenu)}
  >
    <Text style={styles.radiusValue}>
      {radiusOptions.find(opt => opt.value === searchRadius)?.label}
    </Text>
    <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.primary} />
  </TouchableOpacity>
</View>
```

#### **Menu Modal**
```typescript
<Modal
  visible={showRadiusMenu}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowRadiusMenu(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setShowRadiusMenu(false)}
  >
    <View style={styles.radiusMenuModal}>
      {radiusOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radiusMenuItem}
          onPress={() => {
            setSearchRadius(option.value);
            setShowRadiusMenu(false);
          }}
        >
          <Text style={[
            styles.radiusMenuItemText,
            searchRadius === option.value && styles.radiusMenuItemTextActive
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </TouchableOpacity>
</Modal>
```

### **Mise à Jour Automatique**

#### **Effet de Changement de Rayon**
```typescript
useEffect(() => {
  if (userLocation) {
    fetchRecyclingPoints(userLocation.lat, userLocation.lon);
  }
}, [searchRadius, userLocation, fetchRecyclingPoints]);
```

#### **Intégration avec Overpass API**
```typescript
const overpassQuery = `
  [out:json][timeout:25];
  (
    node["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
    way["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
    relation["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
    // ... autres types avec around:${searchRadius}
  );
  out body;
  >;
  out skel qt;
`;
```

## 🎨 **Interface Utilisateur Modernisée**

### **Layout Compact**

#### **Section de Localisation**
- **Position à gauche** : Ville avec emoji 📍
- **Rayon à droite** : Sélecteur compact
- **Bouton de rafraîchissement** : Centré et unique

#### **Section de Filtres**
- **Scroll horizontal** : Navigation fluide
- **Boutons visuels** : Icônes et couleurs distinctes
- **Bouton "Effacer"** : Apparition conditionnelle

### **Design Responsive**

#### **Adaptation Mobile**
- **Filtres scrollables** : Fonctionne sur tous les écrans
- **Menu de rayon** : Modal overlay toujours visible
- **Boutons tactiles** : Taille optimisée pour le touch

#### **Gestion des États**
- **Filtres actifs** : Visuellement distincts
- **Rayon sélectionné** : Mise en évidence claire
- **Chargement** : Indicateurs visuels appropriés

## 🔧 **Implémentation Technique**

### **Structure des Données**

#### **État des Filtres**
```typescript
const [activeFilters, setActiveFilters] = useState<string[]>([]);
const [filteredPoints, setFilteredPoints] = useState<RecyclingPoint[]>([]);
```

#### **État du Rayon**
```typescript
const [searchRadius, setSearchRadius] = useState<number>(1000);
const [showRadiusMenu, setShowRadiusMenu] = useState<boolean>(false);
```

### **Performance et Optimisation**

#### **Filtrage Client-Side**
- **Réactivité maximale** : Pas de délai réseau
- **Mise à jour instantanée** : Filtrage en temps réel
- **Gestion mémoire** : Points filtrés stockés localement

#### **Débogage et Logs**
```typescript
console.log('🔍 Appliquer les filtres:', activeFilters);
console.log('📍 Points disponibles:', recyclingPoints.length);
console.log(`🔍 Point: ${point.display_name}`);
console.log(`   Type: ${point.type}`);
console.log(`🎯 Résultat: ${filtered.length} points filtrés sur ${recyclingPoints.length} total`);
```

## 🚀 **Avantages Utilisateur**

### **Expérience de Filtrage**
- **Recherche précise** : Trouve facilement les points spécifiques
- **Interface intuitive** : Boutons visuels avec icônes distinctes
- **Filtrage rapide** : Résultats en temps réel
- **Gestion des filtres** : Ajout/suppression facile

### **Contrôle du Rayon**
- **Flexibilité** : Choix du rayon selon les besoins
- **Interface compacte** : Sélecteur qui ne prend pas de place
- **Mise à jour immédiate** : Résultats instantanés
- **Rayons adaptés** : Du très proche au très large

### **Interface Optimisée**
- **Plus d'espace** : Layout compact pour le contenu principal
- **Navigation fluide** : Filtres et rayon facilement accessibles
- **Design cohérent** : Style uniforme avec le reste de l'application
- **Responsive** : Fonctionne sur tous les appareils

## 🔮 **Évolutions Futures**

### **Version 7.1.0 (Prévue)**
- **🗺️ Carte interactive** : Affichage des points filtrés sur une carte
- **💾 Sauvegarde des préférences** : Mémorisation des filtres et rayon favoris
- **🔔 Notifications** : Rappels de recyclage personnalisés
- **📊 Statistiques de filtrage** : Historique des recherches populaires

### **Version 7.2.0 (Prévue)**
- **🤖 IA de recommandation** : Suggestions de points selon l'historique
- **🌍 Mode hors ligne** : Synchronisation des données de recyclage
- **📱 Widgets** : Accès rapide aux filtres depuis l'écran d'accueil
- **🌙 Mode sombre** : Thème adaptatif pour l'interface

---

## 📚 **Références Techniques**

- **React Native** : [Documentation officielle](https://reactnative.dev/)
- **Material Icons** : [Bibliothèque d'icônes](https://material.io/icons/)
- **Overpass API** : [Documentation API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- **Nominatim API** : [Documentation API](https://nominatim.org/release-docs/latest/api/Overview/)

---

**Documentation générée le :** Décembre 2024  
**Version EcoTri :** 7.0.0  
**Auteur :** Assistant IA - EcoTri Development Team
