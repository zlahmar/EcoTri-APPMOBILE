import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Image,
  Modal,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import Header from '../../components/common/Header';
import { useLocation, localStatsService } from '../../services';

interface HomeScreenProps {
  isAuthenticated?: boolean;
  onProfilePress?: () => void;
  userInfo?: any;
}

interface RecyclingPoint {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  distance?: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  isAuthenticated = false,
  onProfilePress,
  userInfo: _userInfo,
}) => {
  const [recyclingPoints, setRecyclingPoints] = useState<RecyclingPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<RecyclingPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchRadius, setSearchRadius] = useState<number>(1000); // Rayon en mètres
  const [showRadiusMenu, setShowRadiusMenu] = useState<boolean>(false);

  // Utilisation du service de géolocalisation
  const {
    city: userCity,
    location,
    getCurrentLocation,
  } = useLocation({
    onLocationUpdate: locationData => {
      console.log(' Nouvelle localisation dans HomeScreen:', locationData);
      if (locationData) {
        fetchRecyclingPoints(locationData.latitude, locationData.longitude);
      }
    },
    onError: error => {
      console.error('Erreur de localisation dans HomeScreen:', error);
    },
    onPermissionDenied: () => {
      console.log('Permission de localisation refusée dans HomeScreen');
    },
  });

  // Options de rayon de recherche
  const radiusOptions = [
    { value: 500, label: '500m' },
    { value: 1000, label: '1km' },
    { value: 2000, label: '2km' },
    { value: 5000, label: '5km' },
    { value: 10000, label: '10km' },
  ];

  // Types de filtres disponibles
  const availableFilters = [
    { key: 'glass', label: 'Verre', icon: 'wine-bar', color: colors.success },
    {
      key: 'plastic',
      label: 'Plastique',
      icon: 'local-drink',
      color: colors.primary,
    },
    {
      key: 'paper',
      label: 'Papier',
      icon: 'description',
      color: colors.warning,
    },
    { key: 'metal', label: 'Métal', icon: 'hardware', color: colors.text },
    {
      key: 'electronics',
      label: 'Électronique',
      icon: 'devices',
      color: colors.error,
    },
    {
      key: 'textile',
      label: 'Textile',
      icon: 'checkroom',
      color: colors.primary,
    },
    {
      key: 'batteries',
      label: 'Piles',
      icon: 'battery-charging-full',
      color: colors.warning,
    },
    { key: 'organic', label: 'Organique', icon: 'eco', color: colors.success },
  ];

  // Calcul de la distance entre deux points (formule de Haversine)
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c * 1000;
    },
    [],
  );

  // Traduction des types de recyclage
  const translateRecyclingType = useCallback((type: string): string => {
    const translations: { [key: string]: string } = {
      glass: 'Verre',
      plastic: 'Plastique',
      paper: 'Papier',
      metal: 'Métal',
      electronics: 'Électronique',
      textile: 'Textile',
      batteries: 'Piles',
      organic: 'Organique',
      wood: 'Bois',
      light_bulbs: 'Ampoules',
      general: 'Général',
    };

    return translations[type] || type;
  }, []);

  // Formatage de l'adresse à partir des tags
  const formatAddressFromTags = useCallback((tags: any): string => {
    if (!tags) return 'Point de recyclage';

    const addressParts = [];

    // Priorité au nom du point
    if (tags.name) {
      addressParts.push(tags.name);
    } else if (tags['addr:street']) {
      // Si pas de nom, utiliser la rue
      addressParts.push(tags['addr:street']);
    } else if (tags.amenity) {
      // Si pas de nom ni rue, utiliser le type d'amenity
      const amenityTranslations: { [key: string]: string } = {
        'recycling': 'Point de recyclage',
        'waste_disposal': 'Point de collecte',
        'waste_transfer_station': 'Station de transfert',
        'waste_basket': 'Poubelle',
        'waste_collection': 'Collecte de déchets',
      };
      addressParts.push(amenityTranslations[tags.amenity] || 'Point de recyclage');
    }

    // Ajouter les détails d'adresse si disponibles
    if (tags['addr:housenumber'] && tags['addr:street']) {
      addressParts.push(`${tags['addr:housenumber']} ${tags['addr:street']}`);
    } else if (tags['addr:street'] && !tags.name) {
      // Ne pas dupliquer si on a déjà utilisé la rue comme nom
    } else if (tags['addr:street']) {
      addressParts.push(tags['addr:street']);
    }

    if (tags['addr:postcode']) {
      addressParts.push(tags['addr:postcode']);
    }

    if (tags['addr:city']) {
      addressParts.push(tags['addr:city']);
    }

    if (addressParts.length === 0) {
      return 'Point de recyclage';
    }

    return addressParts.join(', ');
  }, []);

  // Récupération des types de recyclage à partir des tags
  const getRecyclingTypes = useCallback((tags: any): string => {
    if (!tags) return 'Type non spécifié';

    const types = [];

    // Vérifier les tags de recyclage spécifiques (format OpenStreetMap avec :)
    if (
      tags['recycling:glass_bottles'] === 'yes' ||
      tags['recycling:glass'] === 'yes' ||
      tags.recycling_glass === 'yes' ||
      tags.recycling_glass === 'container'
    ) {
      types.push('glass');
    }

    if (
      tags['recycling:plastic'] === 'yes' ||
      tags.recycling_plastic === 'yes' ||
      tags.recycling_plastic === 'container'
    ) {
      types.push('plastic');
    }

    if (
      tags['recycling:paper'] === 'yes' ||
      tags['recycling:cartons'] === 'yes' ||
      tags.recycling_paper === 'yes' ||
      tags.recycling_paper === 'container'
    ) {
      types.push('paper');
    }

    if (
      tags['recycling:metal'] === 'yes' ||
      tags['recycling:cans'] === 'yes' ||
      tags.recycling_metal === 'yes' ||
      tags.recycling_metal === 'container'
    ) {
      types.push('metal');
    }

    if (
      tags['recycling:electrical'] === 'yes' ||
      tags['recycling:electrical_items'] === 'yes' ||
      tags.recycling_electronics === 'yes' ||
      tags.recycling_electronics === 'container'
    ) {
      types.push('electronics');
    }

    if (
      tags['recycling:clothes'] === 'yes' ||
      tags.recycling_textile === 'yes' ||
      tags.recycling_textile === 'container'
    ) {
      types.push('textile');
    }

    if (
      tags['recycling:batteries'] === 'yes' ||
      tags['recycling:accumulator'] === 'yes' ||
      tags.recycling_batteries === 'yes' ||
      tags.recycling_batteries === 'container'
    ) {
      types.push('batteries');
    }

    if (
      tags['recycling:organic'] === 'yes' ||
      tags['recycling:organic_waste'] === 'yes' ||
      tags['recycling:food_waste'] === 'yes' ||
      tags['recycling:green_waste'] === 'yes' ||
      tags.recycling_organic === 'yes' ||
      tags.recycling_organic === 'container'
    ) {
      types.push('organic');
    }

    if (
      tags['recycling:wood'] === 'yes' ||
      tags['recycling:wood_waste'] === 'yes'
    ) {
      types.push('wood');
    }

    if (
      tags['recycling:light_bulbs'] === 'yes'
    ) {
      types.push('light_bulbs');
    }

    // Vérifier les tags génériques
    if (tags.recycling) {
      if (tags.recycling.includes('glass') || tags.recycling.includes('verre')) {
        types.push('glass');
      }
      if (tags.recycling.includes('plastic') || tags.recycling.includes('plastique')) {
        types.push('plastic');
      }
      if (tags.recycling.includes('paper') || tags.recycling.includes('papier')) {
        types.push('paper');
      }
      if (tags.recycling.includes('metal') || tags.recycling.includes('métal')) {
        types.push('metal');
      }
      if (tags.recycling.includes('electronics') || tags.recycling.includes('électronique')) {
        types.push('electronics');
      }
    }

    // Vérifier les tags de description
    if (tags.description) {
      const desc = tags.description.toLowerCase();
      if (desc.includes('verre') || desc.includes('glass')) {
        types.push('glass');
      }
      if (desc.includes('plastique') || desc.includes('plastic')) {
        types.push('plastic');
      }
      if (desc.includes('papier') || desc.includes('paper')) {
        types.push('paper');
      }
      if (desc.includes('métal') || desc.includes('metal')) {
        types.push('metal');
      }
      if (desc.includes('électronique') || desc.includes('electronics')) {
        types.push('electronics');
      }
    }

    // Vérifier le nom du point pour extraire les types
    if (tags.name) {
      const name = tags.name.toLowerCase();
      if (name.includes('verre') || name.includes('glass')) {
        types.push('glass');
      }
      if (name.includes('plastique') || name.includes('plastic')) {
        types.push('plastic');
      }
      if (name.includes('papier') || name.includes('paper')) {
        types.push('paper');
      }
      if (name.includes('métal') || name.includes('metal')) {
        types.push('metal');
      }
      if (name.includes('électronique') || name.includes('electronics')) {
        types.push('electronics');
      }
      if (name.includes('compost') || name.includes('organique')) {
        types.push('organic');
      }
    }

    // Supprimer les doublons
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length === 0) {
      return 'Type non spécifié';
    }

    // Traduire les types
    return uniqueTypes.map(type => translateRecyclingType(type)).join(', ');
  }, [translateRecyclingType]);

  // Fallback avec Nominatim si Overpass ne trouve pas
  const fetchRecyclingPointsFallback = useCallback(
    async (lat: number, lon: number) => {
      try {
        console.log('Tentative de récupération via Nominatim...');

        const searchQuery = `recycling center near ${lat},${lon}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}&limit=15&radius=5000`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const points = data
            .filter(
              (point: any) =>
                point.display_name.toLowerCase().includes('recycl') ||
                point.display_name.toLowerCase().includes('déchetterie') ||
                point.display_name.toLowerCase().includes('collecte') ||
                point.display_name.toLowerCase().includes('déchet') ||
                point.display_name.toLowerCase().includes('verre') ||
                point.display_name.toLowerCase().includes('plastique') ||
                point.display_name.toLowerCase().includes('papier') ||
                point.display_name.toLowerCase().includes('métal') ||
                point.display_name.toLowerCase().includes('électro') ||
                point.display_name.toLowerCase().includes('textile') ||
                point.display_name.toLowerCase().includes('batterie') ||
                point.display_name.toLowerCase().includes('huile') ||
                point.display_name.toLowerCase().includes('peinture') ||
                point.display_name.toLowerCase().includes('médicament') ||
                point.display_name.toLowerCase().includes('pharmacie'),
            )
            .map((point: any) => {
              // Extraire le type de recyclage à partir du nom
              const name = point.display_name.toLowerCase();
              const types = [];
              
              if (name.includes('verre') || name.includes('glass')) {
                types.push('Verre');
              }
              if (name.includes('plastique') || name.includes('plastic')) {
                types.push('Plastique');
              }
              if (name.includes('papier') || name.includes('paper')) {
                types.push('Papier');
              }
              if (name.includes('métal') || name.includes('metal')) {
                types.push('Métal');
              }
              if (name.includes('électronique') || name.includes('electronics')) {
                types.push('Électronique');
              }
              if (name.includes('textile')) {
                types.push('Textile');
              }
              if (name.includes('batterie') || name.includes('battery')) {
                types.push('Piles');
              }
              if (name.includes('organique') || name.includes('organic') || name.includes('compost')) {
                types.push('Organique');
              }
              
              // Si c'est une déchetterie, c'est général
              if (name.includes('déchetterie') || name.includes('déchèterie')) {
                types.push('Déchetterie');
              }
              
              return {
                place_id: point.place_id,
                display_name: point.display_name,
                lat: point.lat,
                lon: point.lon,
                type: types.length > 0 ? types.join(', ') : 'Type non spécifié',
                distance: calculateDistance(
                  lat,
                  lon,
                  parseFloat(point.lat),
                  parseFloat(point.lon),
                ),
              };
            })
            .sort(
              (a: RecyclingPoint, b: RecyclingPoint) =>
                (a.distance || 0) - (b.distance || 0),
            );

          setRecyclingPoints(points);
          setFilteredPoints(points);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération via Nominatim:', error);
      }
    },
    [calculateDistance],
  );

  // Traitement des données Overpass et formatage
  const processOverpassData = useCallback(
    (data: any, userLat: number, userLon: number) => {
      if (data.elements && Array.isArray(data.elements)) {
        const points = data.elements
          .filter((el: any) => el.lat && el.lon)
          .map((el: any) => {
            const recyclingType = getRecyclingTypes(el.tags);
            
            return {
              place_id: el.id,
              display_name: formatAddressFromTags(el.tags),
              lat: el.lat.toString(),
              lon: el.lon.toString(),
              type: recyclingType,
              distance: calculateDistance(userLat, userLon, el.lat, el.lon),
              tags: el.tags,
              rawElement: el,
            };
          })
          .sort(
            (a: RecyclingPoint, b: RecyclingPoint) =>
              (a.distance || 0) - (b.distance || 0),
          );

        setRecyclingPoints(points);
        setFilteredPoints(points);

        if (points.length === 0) {
          fetchRecyclingPointsFallback(userLat, userLon);
        }
      } else {
        setRecyclingPoints([]);
        setFilteredPoints([]);
        fetchRecyclingPointsFallback(userLat, userLon);
      }
    },
    [
      calculateDistance,
      formatAddressFromTags,
      getRecyclingTypes,
      fetchRecyclingPointsFallback,
    ],
  );

  // Récupération des points de recyclage via Overpass API
  const fetchRecyclingPoints = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);

      try {
        const statsResult = await localStatsService.addRecyclingPointSearch();
        if (statsResult) {
          console.log('Recherche de points enregistrée:', statsResult.message);
        } else {
          console.log(
            "Impossible d'enregistrer la recherche (utilisateur non connecté)",
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement de la recherche:",
          error,
        );
      }

      try {
        const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
          way["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
          relation["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
      `;

        try {
          const response = await fetch(
            'https://overpass.kumi.systems/api/interpreter',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'EcoTri/1.0 (zineblahmar1@gmail.com)',
              },
              body: `data=${encodeURIComponent(overpassQuery)}`,
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const text = await response.text();

          if (text.trim().startsWith('<')) {
            console.error('API surchargée - réessayez plus tard');
            throw new Error('API surchargée');
          }

          const data = JSON.parse(text);
          processOverpassData(data, latitude, longitude);
        } catch (error) {
          console.log(
            'Serveur principal échoué, essai avec le serveur alternatif...',
          );

          // Serveur alternatif en cas d'échec
          const response = await fetch(
            'https://overpass-api.de/api/interpreter',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'EcoTri/1.0 (zineblahmar1@gmail.com)',
              },
              body: `data=${encodeURIComponent(overpassQuery)}`,
            },
          );

          if (response.ok) {
            const data = await response.json();
            processOverpassData(data, latitude, longitude);
          } else {
            throw new Error('Tous les serveurs Overpass sont indisponibles');
          }
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des points de recyclage:',
          error,
        );
        Alert.alert(
          'Erreur',
          'Impossible de récupérer les points de recyclage. Réessayez plus tard.',
        );
      } finally {
        setLoading(false);
      }
    },
    [searchRadius, processOverpassData],
  );

  // Application des filtres
  const applyFilters = useCallback(() => {
    if (activeFilters.length === 0) {
      setFilteredPoints(recyclingPoints);
      return;
    }

    const filtered = recyclingPoints.filter(point => {
      const pointType = point.type.toLowerCase();
      const pointName = point.display_name.toLowerCase();

      const isMatch = activeFilters.some(filter => {
        if (pointType.includes(filter)) {
          return true;
        }

        if (pointName.includes(filter)) {
          return true;
        }

        const filterKeywords = getFilterKeywords(filter);
        const keywordMatch = filterKeywords.some(
          keyword => pointType.includes(keyword) || pointName.includes(keyword),
        );

        return keywordMatch;
      });

      return isMatch;
    });

    setFilteredPoints(filtered);
  }, [activeFilters, recyclingPoints]);

  // Activation d'un filtre
  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filterKey)) {
        return prev.filter(f => f !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
  };

  // Suppression de tous les filtres
  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  // Récupération des mots-clés pour chaque filtre
  const getFilterKeywords = (filterKey: string): string[] => {
    const keywords: { [key: string]: string[] } = {
      glass: [
        'verre',
        'bouteille',
        'bouteilles',
        'glass',
        'bouteilles en verre',
        'contenants en verre',
      ],
      plastic: [
        'plastique',
        'plastic',
        'bouteilles en plastique',
        'emballages plastique',
      ],
      paper: [
        'papier',
        'paper',
        'carton',
        'cardboard',
        'livres',
        'magazines',
        'journaux',
      ],
      metal: [
        'métal',
        'metal',
        'aluminium',
        'acier',
        'steel',
        'boîtes',
        'canettes',
      ],
      electronics: [
        'électronique',
        'electronics',
        'électrique',
        'appareils',
        'téléphone',
        'ordinateur',
      ],
      textile: ['textile', 'vêtements', 'clothes', 'chaussures', 'shoes'],
      batteries: ['piles', 'batteries', 'batterie', 'ampoules', 'light_bulbs'],
      organic: [
        'organique',
        'organic',
        'compost',
        'déchets verts',
        'garden_waste',
        'biodegradable',
      ],
    };

    return keywords[filterKey] || [filterKey];
  };

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    applyFilters();
  }, [activeFilters, recyclingPoints, applyFilters]);

  useEffect(() => {
    if (location) {
      fetchRecyclingPoints(location.latitude, location.longitude);
    }
  }, [searchRadius, location, fetchRecyclingPoints]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchRecyclingPoints(location.latitude, location.longitude);
    }
    setRefreshing(false);
  };

  // Ouverture de la navigation vers un point
  const openNavigation = async (point: RecyclingPoint) => {
    const latitude = parseFloat(point.lat);
    const longitude = parseFloat(point.lon);

    // Détection des apps de navigation disponibles
    const availableApps = await detectAvailableNavigationApps(
      latitude,
      longitude,
    );

    if (availableApps.length === 0) {
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      await Linking.openURL(webUrl);
      return;
    }

    const alertOptions = [
      { text: 'Annuler', style: 'cancel' as const },
      ...availableApps.map(app => ({
        text: app.name,
        onPress: () => openApp(app.url, app.name, latitude, longitude),
      })),
    ];

    Alert.alert(
      'Navigation vers le point de recyclage',
      `Voulez-vous naviguer vers ${point.display_name} ?`,
      alertOptions,
    );
  };

  // Détection des apps de navigation disponibles
  const detectAvailableNavigationApps = async (
    latitude: number,
    longitude: number,
  ) => {
    const apps = [];

    // Liste des apps de navigation populaires avec leurs URLs
    const navigationApps = [
      {
        name: 'Google Maps',
        url: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`,
        scheme: 'comgooglemaps://',
      },
      {
        name: 'Waze',
        url: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
        scheme: 'waze://',
      },
      {
        name: 'Apple Maps (iOS)',
        url: `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
        scheme: 'maps://',
      },
      {
        name: 'HERE WeGo',
        url: `here-route://mylocation/${latitude},${longitude}`,
        scheme: 'here-route://',
      },
      {
        name: 'Sygic',
        url: `sygic://navigate?lat=${latitude}&lon=${longitude}`,
        scheme: 'sygic://',
      },
      {
        name: 'TomTom GO',
        url: `tomtomgo://x-callback-url/navigate?lat=${latitude}&lon=${longitude}`,
        scheme: 'tomtomgo://',
      },
      {
        name: 'Maps.me',
        url: `mapsme://route?ll=${latitude},${longitude}`,
        scheme: 'mapsme://',
      },
    ];

    for (const app of navigationApps) {
      try {
        const canOpen = await Linking.canOpenURL(app.scheme);
        if (canOpen) {
          apps.push(app);
          console.log(`App détectée: ${app.name}`);
        }
      } catch (error) {
        console.log(`Erreur lors de la vérification de ${app.name}:`, error);
      }
    }

    const defaultMapsUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    try {
      const canOpenDefault = await Linking.canOpenURL(defaultMapsUrl);
      if (canOpenDefault) {
        apps.push({
          name: 'App de navigation par défaut',
          url: defaultMapsUrl,
          scheme: 'geo:',
        });
        console.log('App de navigation par défaut détectée');
      }
    } catch (error) {
      console.log("Erreur lors de la vérification de l'app par défaut:", error);
    }

    console.log(`${apps.length} apps de navigation disponibles`);
    return apps;
  };

  // Ouverture d'une application ou URL
  const openApp = async (
    url: string,
    appName: string,
    latitude: number,
    longitude: number,
  ) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        console.log(`Navigation ouverte dans ${appName}`);
      } else {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        await Linking.openURL(webUrl);
        console.log('Navigation ouverte dans le navigateur web');
      }
    } catch (error) {
      console.error(`Erreur lors de l'ouverture de ${appName}:`, error);
      Alert.alert(
        'Erreur de navigation',
        `Impossible d'ouvrir ${appName}. Vérifiez que l'application est installée.`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="EcoTri - Accueil"
        showProfileIcon={true}
        isAuthenticated={isAuthenticated}
        onProfilePress={onProfilePress}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Section de bienvenue */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoTitleContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.welcomeTitle}>Bienvenue sur EcoTri !</Text>
          </View>
          <Text style={styles.welcomeSubtitle}>
            Découvrez les points de recyclage près de chez vous
          </Text>
        </View>

        {/* Section de géolocalisation */}
        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <View style={styles.locationInfo}>
              <View style={styles.locationHeader}>
                <MaterialIcons
                  name="location-on"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.locationTitle}>Votre Position</Text>
              </View>
              <Text style={styles.locationText}>
                {userCity ? `📍 ${userCity}` : '📍 Localisation en cours...'}
              </Text>
            </View>

            <View style={styles.radiusInfo}>
              <Text style={styles.radiusLabel}>Rayon :</Text>
              <View style={styles.radiusSelector}>
                <TouchableOpacity
                  style={styles.radiusDropdown}
                  onPress={() => setShowRadiusMenu(!showRadiusMenu)}
                >
                  <Text style={styles.radiusValue}>
                    {
                      radiusOptions.find(opt => opt.value === searchRadius)
                        ?.label
                    }
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>

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
                      {radiusOptions.map(option => (
                        <TouchableOpacity
                          key={option.value}
                          style={styles.radiusMenuItem}
                          onPress={() => {
                            setSearchRadius(option.value);
                            setShowRadiusMenu(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.radiusMenuItemText,
                              searchRadius === option.value &&
                                styles.radiusMenuItemTextActive,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </View>
          </View>

          <View style={styles.locationActions}>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <MaterialIcons name="refresh" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recyclingSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="recycling" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Points de Recyclage Proches</Text>
          </View>

          <View style={styles.filtersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {availableFilters.map(filter => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    activeFilters.includes(filter.key) &&
                      styles.filterButtonActive,
                  ]}
                  onPress={() => toggleFilter(filter.key)}
                >
                  <MaterialIcons
                    name={filter.icon as any}
                    size={16}
                    color={
                      activeFilters.includes(filter.key)
                        ? colors.textInverse
                        : filter.color
                    }
                  />
                  <Text
                    style={[
                      styles.filterButtonText,
                      activeFilters.includes(filter.key) &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {activeFilters.length > 0 && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearAllFilters}
              >
                <MaterialIcons name="clear" size={16} color={colors.error} />
                <Text style={styles.clearFiltersText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>
                Recherche des points de recyclage...
              </Text>
            </View>
          ) : (activeFilters.length > 0 ? filteredPoints : recyclingPoints)
              .length > 0 ? (
            <View style={styles.pointsList}>
              {(activeFilters.length > 0
                ? filteredPoints
                : recyclingPoints
              ).map((point, _index) => (
                <TouchableOpacity
                  key={point.place_id}
                  style={styles.pointCard}
                  onPress={() => openNavigation(point)}
                >
                  <View style={styles.pointIcon}>
                    <MaterialIcons
                      name="location-on"
                      size={24}
                      color={colors.success}
                    />
                  </View>
                  <View style={styles.pointInfo}>
                    <Text style={styles.pointName} numberOfLines={2}>
                      {point.display_name}
                    </Text>
                    <Text style={styles.pointType}>{point.type}</Text>
                    <Text style={styles.pointDistance}>
                      📍 À {(point.distance || 0).toFixed(0)}m de votre position
                    </Text>
                  </View>
                  <View style={styles.pointAction}>
                    <MaterialIcons
                      name="directions"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noPointsContainer}>
              <MaterialIcons
                name="search-off"
                size={48}
                color={colors.textLight}
              />
              <Text style={styles.noPointsText}>
                Aucun point de recyclage trouvé
              </Text>
              <Text style={styles.noPointsSubtext}>
                Essayez d'élargir la zone de recherche ou vérifiez votre
                position
              </Text>
            </View>
          )}
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons
                name="camera-alt"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.actionText}>Scanner un déchet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons
                name="recycling"
                size={32}
                color={colors.success}
              />
              <Text style={styles.actionText}>Voir la collecte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons
                name="lightbulb"
                size={32}
                color={colors.warning}
              />
              <Text style={styles.actionText}>Conseils</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  locationSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  locationText: {
    fontSize: 13,
    color: colors.text,
  },
  radiusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  radiusLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginRight: 6,
  },
  radiusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 1,
    zIndex: 9999,
  },
  radiusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radiusValue: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
    marginRight: 4,
  },
  radiusMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  radiusMenuItemText: {
    fontSize: 13,
    color: colors.text,
  },
  radiusMenuItemTextActive: {
    color: colors.textInverse,
    backgroundColor: colors.primary,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  refreshButton: {
    padding: 6,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  locationButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  recyclingSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    color: colors.textLight,
    fontSize: 14,
  },
  pointsList: {
    // Aucun style spécifique pour la liste, elle sera gérée par pointCard
  },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pointIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pointInfo: {
    flex: 1,
    marginRight: 12,
  },
  pointName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  pointType: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  pointDistance: {
    fontSize: 11,
    color: colors.textLight,
  },
  pointAction: {
    padding: 8,
  },
  noPointsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  noPointsSubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 6,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  filtersScroll: {
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: colors.textInverse,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearFiltersText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusMenuModal: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    width: 120,
    elevation: 9999,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 9999,
      },
    }),
  },
});

export default HomeScreen;
