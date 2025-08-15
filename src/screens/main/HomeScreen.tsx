import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
  PermissionsAndroid,
  Linking,
  Image,
  Modal,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import Header from '../../components/common/Header';

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
  userInfo: _userInfo 
}) => {
  const [recyclingPoints, setRecyclingPoints] = useState<RecyclingPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<RecyclingPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'checking'>('checking');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchRadius, setSearchRadius] = useState<number>(1000); // Rayon en mètres
  const [showRadiusMenu, setShowRadiusMenu] = useState<boolean>(false);

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
    { key: 'plastic', label: 'Plastique', icon: 'local-drink', color: colors.primary },
    { key: 'paper', label: 'Papier', icon: 'description', color: colors.warning },
    { key: 'metal', label: 'Métal', icon: 'hardware', color: colors.text },
    { key: 'electronics', label: 'Électronique', icon: 'devices', color: colors.error },
    { key: 'textile', label: 'Textile', icon: 'checkroom', color: colors.primary },
    { key: 'batteries', label: 'Piles', icon: 'battery-charging-full', color: colors.warning },
    { key: 'organic', label: 'Organique', icon: 'eco', color: colors.success },
  ];

  // Appliquer les filtres
  const applyFilters = useCallback(() => {
    if (activeFilters.length === 0) {
      setFilteredPoints(recyclingPoints);
      return;
    }

    const filtered = recyclingPoints.filter(point => {
      const pointType = point.type.toLowerCase();
      const pointName = point.display_name.toLowerCase();
      
      const isMatch = activeFilters.some(filter => {
        // Chercher dans le type du point
        if (pointType.includes(filter)) {
          return true;
        }
        
        // Chercher dans le nom/description du point
        if (pointName.includes(filter)) {
          return true;
        }
        
        // Chercher des mots-clés spécifiques pour chaque filtre
        const filterKeywords = getFilterKeywords(filter);
        const keywordMatch = filterKeywords.some(keyword => 
          pointType.includes(keyword) || pointName.includes(keyword)
        );
        
        return keywordMatch;
      });
      
      return isMatch;
    });

    setFilteredPoints(filtered);
  }, [activeFilters, recyclingPoints]);

  // Toggle un filtre
  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filterKey)) {
        return prev.filter(f => f !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
  };

  // Effacer tous les filtres
  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  // Calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance en mètres
  }, []);

  // Récupérer les points de recyclage via Overpass API
  const fetchRecyclingPoints = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
          way["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
          relation["amenity"="recycling"](around:${searchRadius},${latitude},${longitude});
          node["recycling:glass"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:glass"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:plastic"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:plastic"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:paper"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:paper"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:metal"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:metal"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:electronics"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:electronics"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:clothes"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:clothes"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:batteries"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:batteries"="yes"](around:${searchRadius},${latitude},${longitude});
          node["recycling:organic"="yes"](around:${searchRadius},${latitude},${longitude});
          way["recycling:organic"="yes"](around:${searchRadius},${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
      `;

      // Essayer d'abord le serveur principal
      try {
        const response = await fetch("https://overpass.kumi.systems/api/interpreter", {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "EcoTri/1.0 (zineblahmar1@gmail.com)"
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
        });

        if (!response.ok) {
          console.error(`Erreur API: ${response.status}`);
          throw new Error(`Erreur API: ${response.status}`);
        }

        const text = await response.text();
        
        if (text.trim().startsWith("<")) {
          console.error("API surchargée - réessayez plus tard");
          throw new Error("API surchargée");
        }

        const data = JSON.parse(text);
        processOverpassData(data, latitude, longitude);
        
      } catch (error) {
        console.log("Serveur principal échoué, essai avec le serveur alternatif...");
        
        // Serveur alternatif en cas d'échec
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "EcoTri/1.0 (zineblahmar1@gmail.com)"
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
        });

        if (response.ok) {
          const data = await response.json();
          processOverpassData(data, latitude, longitude);
        } else {
          throw new Error("Tous les serveurs Overpass sont indisponibles");
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des points de recyclage:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les points de recyclage. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  }, [searchRadius, processOverpassData]);

  // Traiter les données Overpass et les formater
  const processOverpassData = useCallback((data: any, userLat: number, userLon: number) => {
    if (data.elements && Array.isArray(data.elements)) {
      const points = data.elements
        .filter((el: any) => el.lat && el.lon) // Filtrer les éléments avec coordonnées
        .map((el: any) => ({
          place_id: el.id,
          display_name: formatAddressFromTags(el.tags),
          lat: el.lat.toString(),
          lon: el.lon.toString(),
          type: getRecyclingTypes(el.tags),
          distance: calculateDistance(userLat, userLon, el.lat, el.lon),
          tags: el.tags,
          rawElement: el
        }))
        .sort((a: RecyclingPoint, b: RecyclingPoint) => (a.distance || 0) - (b.distance || 0));
      
      setRecyclingPoints(points);
      setFilteredPoints(points); // Initialiser les points filtrés
      
      // Si aucun point trouvé via Overpass, essayer Nominatim comme fallback
      if (points.length === 0) {
        fetchRecyclingPointsFallback(userLat, userLon);
      }
    } else {
      setRecyclingPoints([]);
      setFilteredPoints([]);
      // Essayer Nominatim comme fallback
      fetchRecyclingPointsFallback(userLat, userLon);
    }
  }, [calculateDistance, formatAddressFromTags, getRecyclingTypes, fetchRecyclingPointsFallback]);

  // Fallback avec Nominatim si Overpass ne trouve rien
  const fetchRecyclingPointsFallback = useCallback(async (lat: number, lon: number) => {
    try {
      console.log('Tentative de récupération via Nominatim...');
      
      // Recherche des points de recyclage via Nominatim
      const searchQuery = `recycling center near ${lat},${lon}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=15&radius=5000`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        // Filtrer et formater les résultats
        const points = data
          .filter((point: any) => 
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
            point.display_name.toLowerCase().includes('cartouche') ||
            point.display_name.toLowerCase().includes('téléphone') ||
            point.display_name.toLowerCase().includes('ordinateur') ||
            point.display_name.toLowerCase().includes('électroménager') ||
            point.display_name.toLowerCase().includes('ampoule') ||
            point.display_name.toLowerCase().includes('produit chimique')
          )
          .map((point: any) => ({
            place_id: point.place_id,
            display_name: point.display_name,
            lat: point.lat,
            lon: point.lon,
            type: 'Point de recyclage',
            distance: calculateDistance(lat, lon, parseFloat(point.lat), parseFloat(point.lon)),
            tags: {},
            rawElement: point
          }))
          .sort((a: RecyclingPoint, b: RecyclingPoint) => (a.distance || 0) - (b.distance || 0));
        
        setRecyclingPoints(points);
        setFilteredPoints(points); // Initialiser les points filtrés
        console.log(`${points.length} points de recyclage trouvés via Nominatim (fallback)`);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération via Nominatim:', error);
    }
  }, [calculateDistance]);

  // Formater l'adresse à partir des tags Overpass
  const formatAddressFromTags = useCallback((tags: any): string => {
    if (!tags) return "Point de recyclage";
    
    const parts: string[] = [];
    
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    else if (tags['addr:town']) parts.push(tags['addr:town']);
    
    if (parts.length > 0) {
      return parts.join(', ');
    }
    
    // Fallback sur le nom ou la description
    if (tags.name) return tags.name;
    if (tags.description) return tags.description;
    
    return "Point de recyclage";
  }, []);

  // Extraire les types de recyclage disponibles
  const getRecyclingTypes = useCallback((tags: any): string => {
    if (!tags) return "Recyclage général";
    
    const recyclingTypes: string[] = [];
    
    // Vérifier tous les tags de recyclage
    Object.keys(tags).forEach(key => {
      if (key.startsWith('recycling:') && tags[key] === 'yes') {
        const type = translateRecyclingType(key);
        if (type && !recyclingTypes.includes(type)) {
          recyclingTypes.push(type);
        }
      }
    });
    
    if (recyclingTypes.length > 0) {
      return recyclingTypes.slice(0, 3).join(', '); // Limiter à 3 types
    }
    
    return "Recyclage général";
  }, [translateRecyclingType]);

  // Traduire les types de recyclage en français
  const translateRecyclingType = useCallback((tag: string): string => {
    const translations: { [key: string]: string } = {
      // Tags Overpass spécifiques
      "recycling:glass_bottles": "Bouteilles en verre",
      "recycling:glass": "Verre",
      "recycling:plastic": "Plastique",
      "recycling:plastic_bottles": "Bouteilles en plastique",
      "recycling:paper": "Papier",
      "recycling:cardboard": "Carton",
      "recycling:scrap_metal": "Métal",
      "recycling:metal": "Métal",
      "recycling:organic": "Déchets organiques",
      "recycling:electronics": "Électronique",
      "recycling:electrical_appliances": "Appareils électriques",
      "recycling:textile": "Textile",
      "recycling:clothes": "Vêtements",
      "recycling:shoes": "Chaussures",
      "recycling:aluminium": "Aluminium",
      "recycling:steel": "Acier",
      "recycling:tin_cans": "Boîtes de conserve",
      "recycling:oil": "Huile",
      "recycling:batteries": "Piles",
      "recycling:light_bulbs": "Ampoules",
      "recycling:cds": "CD/DVD",
      "recycling:books": "Livres",
      "recycling:magazines": "Magazines",
      "recycling:newspapers": "Journaux",
      "recycling:wood": "Bois",
      "recycling:green_waste": "Déchets verts",
      "recycling:compost": "Compost",
      "recycling:construction_waste": "Déchets de construction",
      "recycling:bulky_waste": "Encombrants",
      "recycling:household_waste": "Déchets ménagers",
      "recycling:general": "Déchets généraux",
      "recycling:food_waste": "Déchets alimentaires",
      "recycling:kitchen_waste": "Déchets de cuisine",
      "recycling:biodegradable": "Déchets biodégradables",
      "recycling:garden_waste": "Déchets de jardin",
      "recycling:printer_cartridges": "Cartouches d'imprimante",
      "recycling:mobile_phones": "Téléphones mobiles",
      "recycling:computers": "Ordinateurs",
      "recycling:white_goods": "Électroménager",
      "recycling:small_appliances": "Petits appareils",
      "recycling:fluorescent_tubes": "Tubes fluorescents",
      "recycling:energy_saving_bulbs": "Ampoules économiques",
      "recycling:car_batteries": "Batteries de voiture",
      "recycling:engine_oil": "Huile moteur",
      "recycling:cooking_oil": "Huile de cuisson",
      "recycling:paint": "Peinture",
      "recycling:chemicals": "Produits chimiques",
      "recycling:medicines": "Médicaments",
      "recycling:ink_cartridges": "Cartouches d'encre",
      "recycling:toner_cartridges": "Cartouches de toner",
      "recycling:plastic_bags": "Sacs plastique",
      "recycling:plastic_packaging": "Emballages plastique",
      "recycling:glass_containers": "Contenants en verre",
      "recycling:aluminum_cans": "Canettes en aluminium",
      "recycling:steel_cans": "Boîtes en acier",
      "recycling:tetra_pak": "Briques Tetra Pak",
      "recycling:wine_corks": "Bouchons de vin",
      "recycling:coffee_capsules": "Capsules de café",
      "recycling:tea_bags": "Sachets de thé",
      "recycling:food_packaging": "Emballages alimentaires",
      
      // Termes génériques anglais
      "waste": "Déchets",
      "organic waste": "Déchets organiques",
      "general waste": "Déchets généraux",
      "household waste": "Déchets ménagers",
      "recycling": "Recyclage",
      "recycling center": "Centre de recyclage",
      "recycling point": "Point de recyclage",
      "item": "Objet",
      "items": "Objets",
      "materials": "Matériaux",
      "packaging": "Emballages",
      "containers": "Contenants",
      "bottles": "Bouteilles",
      "cans": "Boîtes",
      "boxes": "Cartons",
      "paper": "Papier",
      "cardboard": "Carton",
      "glass": "Verre",
      "plastic": "Plastique",
      "metal": "Métal",
      "aluminum": "Aluminium",
      "steel": "Acier",
      "textile": "Textile",
      "clothes": "Vêtements",
      "shoes": "Chaussures",
      "electronics": "Électronique",
      "electrical": "Électrique",
      "appliances": "Appareils",
      "batteries": "Piles",
      "light bulbs": "Ampoules",
      "oil": "Huile",
      "paint": "Peinture",
      "chemicals": "Produits chimiques",
      "medicines": "Médicaments",
      "books": "Livres",
      "magazines": "Magazines",
      "newspapers": "Journaux",
      "cds": "CD/DVD",
      "computers": "Ordinateurs",
      "phones": "Téléphones",
      "mobile phones": "Téléphones mobiles",
      "printers": "Imprimantes",
      "cartridges": "Cartouches",
      "ink": "Encre",
      "toner": "Toner",
      "wood": "Bois",
      "garden waste": "Déchets de jardin",
      "green waste": "Déchets verts",
      "compost": "Compost",
      "organic": "Organique",
      "biodegradable": "Biodégradable",
      "construction waste": "Déchets de construction",
      "bulky waste": "Encombrants",
      "food waste": "Déchets alimentaires",
      "kitchen waste": "Déchets de cuisine",
      "cooking oil": "Huile de cuisson",
      "engine oil": "Huile moteur",
      "car batteries": "Batteries de voiture",
      "fluorescent tubes": "Tubes fluorescents",
      "energy saving bulbs": "Ampoules économiques",
      "small appliances": "Petits appareils",
      "white goods": "Électroménager",
      "electrical appliances": "Appareils électriques",
      "scrap metal": "Métal de récupération",
      "tin cans": "Boîtes de conserve",
      "tetra pak": "Briques Tetra Pak",
      "wine corks": "Bouchons de vin",
      "coffee capsules": "Capsules de café",
      "tea bags": "Sachets de thé",
      "plastic bags": "Sacs plastique",
      "plastic packaging": "Emballages plastique",
      "glass containers": "Contenants en verre",
      "aluminum cans": "Canettes en aluminium",
      "steel cans": "Boîtes en acier"
    };
    
    // Nettoyer le tag
    const cleanTag = tag.replace("recycling:", "").toLowerCase();
    
    // Chercher une traduction exacte
    if (translations[cleanTag]) {
      return translations[cleanTag];
    }
    
    // Chercher une traduction partielle
    for (const [key, value] of Object.entries(translations)) {
      if (cleanTag.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanTag)) {
        return value;
      }
    }
    
    // Traduction automatique simple pour les termes non traduits
    const autoTranslations: { [key: string]: string } = {
      "waste": "Déchets",
      "organic": "Organique",
      "general": "Général",
      "household": "Ménager",
      "recycling": "Recyclage",
      "center": "Centre",
      "point": "Point",
      "item": "Objet",
      "materials": "Matériaux",
      "packaging": "Emballages",
      "containers": "Contenants",
      "bottles": "Bouteilles",
      "cans": "Boîtes",
      "boxes": "Cartons",
      "clothes": "Vêtements",
      "shoes": "Chaussures",
      "electronics": "Électronique",
      "electrical": "Électrique",
      "appliances": "Appareils",
      "batteries": "Piles",
      "bulbs": "Ampoules",
      "oil": "Huile",
      "paint": "Peinture",
      "chemicals": "Produits chimiques",
      "medicines": "Médicaments",
      "phones": "Téléphones",
      "computers": "Ordinateurs",
      "printers": "Imprimantes",
      "cartridges": "Cartouches",
      "ink": "Encre",
      "toner": "Toner",
      "wood": "Bois",
      "garden": "Jardin",
      "green": "Vert",
      "compost": "Compost",
      "biodegradable": "Biodégradable",
      "construction": "Construction",
      "bulky": "Encombrant",
      "food": "Alimentaire",
      "kitchen": "Cuisine",
      "cooking": "Cuisson",
      "engine": "Moteur",
      "car": "Voiture",
      "fluorescent": "Fluorescent",
      "energy": "Énergie",
      "saving": "Économie",
      "small": "Petit",
      "white": "Blanc",
      "scrap": "Récupération",
      "tin": "Étain",
      "tetra": "Tetra",
      "pak": "Pak",
      "wine": "Vin",
      "corks": "Bouchons",
      "coffee": "Café",
      "capsules": "Capsules",
      "tea": "Thé",
      "bags": "Sacs",
      "plastic": "Plastique",
      "glass": "Verre",
      "aluminum": "Aluminium",
      "steel": "Acier"
    };
    
    // Essayer la traduction automatique mot par mot
    const words = cleanTag.split(/[\s_-]+/);
    const translatedWords = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      return autoTranslations[cleanWord] || word;
    });
    
    // Si on a des traductions, les joindre
    if (translatedWords.some(word => autoTranslations[word.toLowerCase()])) {
      return translatedWords.join(' ');
    }
    
    // Dernier recours : formater le tag original
    return cleanTag
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\b\w+/g, word => {
        const lowerWord = word.toLowerCase();
        return autoTranslations[lowerWord] || word;
      });
  }, []);

  // Obtenir les mots-clés pour chaque filtre
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

  // Demander les permissions de géolocalisation
  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'EcoTri a besoin d\'accéder à votre position pour trouver les points de recyclage proches',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === 'granted') {
          setLocationPermission('granted');
          // Appeler getCurrentLocation après avoir défini la permission
          setTimeout(() => {
            getCurrentLocation();
          }, 500); // Délai un peu plus long pour s'assurer que la permission est bien enregistrée
        } else {
          setLocationPermission('denied');
        }
      } else {
        // Pour iOS, on vérifie d'abord si la permission est déjà accordée
        Geolocation.requestAuthorization('whenInUse');
        setLocationPermission('granted');
        setTimeout(() => {
          getCurrentLocation();
        }, 500);
      }
    } catch (err) {
      setLocationPermission('denied');
    }
  }, [getCurrentLocation]); // Ajouter getCurrentLocation comme dépendance

  // Récupérer le nom de la ville via Nominatim
  const fetchCityFromCoordinates = useCallback(async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
      const response = await fetch(url, {
        headers: { "User-Agent": "EcoTri/1.0 (zineblahmar1@gmail.com)" },
      });
      const data = await response.json();
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Ville inconnue';
        setUserCity(city);
        console.log('Ville détectée:', city);
      } else {
        setUserCity('Ville inconnue');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la ville:', error);
      setUserCity('Ville inconnue');
    }
  }, []);

  // Obtenir la position actuelle avec la vraie géolocalisation
  const getCurrentLocation = useCallback(() => {
    // Ne pas vérifier la permission ici pour éviter la boucle
    // La permission est déjà vérifiée avant l'appel de cette fonction
    
    setLoading(true);
    
    // Timeout de sécurité pour éviter le blocage
    const locationTimeout = setTimeout(() => {
      setLoading(false);
    }, 30000); // 30 secondes de timeout
    
    Geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(locationTimeout);
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lon: longitude };
        
        setUserLocation(location);
        
        // Récupérer le nom de la ville
        fetchCityFromCoordinates(latitude, longitude);
        
        // Récupérer les points de recyclage
        fetchRecyclingPoints(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        clearTimeout(locationTimeout);
        setLoading(false);
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setLocationPermission('denied');
            break;
          case 2: // POSITION_UNAVAILABLE
            break;
          case 3: // TIMEOUT
            break;
          default:
            break;
        }
        
        // Logs détaillés pour le diagnostic
        console.error('🔍 Détails de l\'erreur de géolocalisation:');
        console.error('   Code d\'erreur:', error.code);
        console.error('   Message d\'erreur:', error.message);
        console.error('   Permission actuelle:', locationPermission);
        console.error('   Platform:', Platform.OS);
        console.error('   Timestamp:', new Date().toISOString());
        
        if (error.code === 1) {
          console.error('   ❌ PERMISSION_DENIED - L\'utilisateur a refusé la permission');
        } else if (error.code === 2) {
          console.error('   ❌ POSITION_UNAVAILABLE - Position temporairement indisponible');
        } else if (error.code === 3) {
          console.error('   ❌ TIMEOUT - Délai de géolocalisation dépassé');
        } else {
          console.error('   ❌ Erreur inconnue - Code non reconnu');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 25000, // 25 secondes (légèrement moins que le timeout de sécurité)
        maximumAge: 60000, // 1 minute (plus permissif)
        distanceFilter: 10, // Mise à jour si déplacement > 10m
        forceRequest: true, // Force la demande de position
        showLocationDialog: true, // Affiche le dialogue de localisation Android
      }
    );
  }, [locationPermission, fetchCityFromCoordinates, fetchRecyclingPoints]); // Seulement locationPermission comme dépendance

  // Demander la géolocalisation au démarrage (une seule fois)
  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]); // Remettre la dépendance requestLocationPermission

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [activeFilters, recyclingPoints, applyFilters]);

  // Relancer la recherche quand le rayon change
  useEffect(() => {
    if (userLocation) {
      fetchRecyclingPoints(userLocation.lat, userLocation.lon);
    }
  }, [searchRadius, userLocation, fetchRecyclingPoints]);

  // Actualiser les données
  const onRefresh = async () => {
    setRefreshing(true);
    if (userLocation) {
      // Mettre à jour la ville
      await fetchCityFromCoordinates(userLocation.lat, userLocation.lon);
      // Mettre à jour les points de recyclage
      await fetchRecyclingPoints(userLocation.lat, userLocation.lon);
    }
    setRefreshing(false);
  };

  // Ouvrir la navigation vers un point
  const openNavigation = async (point: RecyclingPoint) => {
    const latitude = parseFloat(point.lat);
    const longitude = parseFloat(point.lon);
    
    // Détecter les apps de navigation disponibles
    const availableApps = await detectAvailableNavigationApps(latitude, longitude);
    
    if (availableApps.length === 0) {
      // Aucune app de navigation trouvée, ouvrir directement dans le navigateur
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      await Linking.openURL(webUrl);
      return;
    }
    
    // Créer les options pour l'alerte
    const alertOptions = [
      { text: 'Annuler', style: 'cancel' as const },
      ...availableApps.map(app => ({
        text: app.name,
        onPress: () => openApp(app.url, app.name, latitude, longitude)
      }))
    ];
    
    Alert.alert(
      'Navigation vers le point de recyclage',
      `Voulez-vous naviguer vers ${point.display_name} ?`,
      alertOptions
    );
  };

  // Détecter les apps de navigation disponibles
  const detectAvailableNavigationApps = async (latitude: number, longitude: number) => {
    const apps = [];
    
    // Liste des apps de navigation populaires avec leurs URLs
    const navigationApps = [
      {
        name: 'Google Maps',
        url: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`,
        scheme: 'comgooglemaps://'
      },
      {
        name: 'Waze',
        url: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
        scheme: 'waze://'
      },
      {
        name: 'Apple Maps (iOS)',
        url: `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
        scheme: 'maps://'
      },
      {
        name: 'HERE WeGo',
        url: `here-route://mylocation/${latitude},${longitude}`,
        scheme: 'here-route://'
      },
      {
        name: 'Sygic',
        url: `sygic://navigate?lat=${latitude}&lon=${longitude}`,
        scheme: 'sygic://'
      },
      {
        name: 'TomTom GO',
        url: `tomtomgo://x-callback-url/navigate?lat=${latitude}&lon=${longitude}`,
        scheme: 'tomtomgo://'
      },
      {
        name: 'Maps.me',
        url: `mapsme://route?ll=${latitude},${longitude}`,
        scheme: 'mapsme://'
      },
      {
        name: 'OsmAnd',
        url: `osmand://navigate?lat=${latitude}&lon=${longitude}`,
        scheme: 'osmand://'
      },
      {
        name: 'Bing Maps',
        url: `bingmaps://?cp=${latitude}~${longitude}&lvl=16`,
        scheme: 'bingmaps://'
      },
      {
        name: 'Yandex Maps',
        url: `yandexmaps://maps.yandex.com/?pt=${longitude},${latitude}&z=16`,
        scheme: 'yandexmaps://'
      }
    ];
    
    // Vérifier quelles apps sont installées
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
    
    // Ajouter l'app de navigation par défaut du système
    const defaultMapsUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    try {
      const canOpenDefault = await Linking.canOpenURL(defaultMapsUrl);
      if (canOpenDefault) {
        apps.push({
          name: 'App de navigation par défaut',
          url: defaultMapsUrl,
          scheme: 'geo:'
        });
        console.log('App de navigation par défaut détectée');
      }
    } catch (error) {
      console.log('Erreur lors de la vérification de l\'app par défaut:', error);
    }
    
    console.log(`${apps.length} apps de navigation disponibles`);
    return apps;
  };

  // Ouvrir une application ou URL
  const openApp = async (url: string, appName: string, latitude: number, longitude: number) => {
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        console.log(`Navigation ouverte dans ${appName}`);
      } else {
        // Si l'URL n'est pas supportée, essayer d'ouvrir dans le navigateur
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        await Linking.openURL(webUrl);
        console.log('Navigation ouverte dans le navigateur web');
      }
    } catch (error) {
      console.error(`Erreur lors de l'ouverture de ${appName}:`, error);
      Alert.alert(
        'Erreur de navigation',
        `Impossible d'ouvrir ${appName}. Vérifiez que l'application est installée.`
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
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.welcomeTitle}>Bienvenue sur EcoTri !</Text>
          </View>
          <Text style={styles.welcomeSubtitle}>
            Découvrez les points de recyclage près de chez vous
          </Text>
        </View>

        {/* Section de géolocalisation */}
        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            {/* Localisation à gauche */}
            <View style={styles.locationInfo}>
              <View style={styles.locationHeader}>
                <MaterialIcons name="location-on" size={18} color={colors.primary} />
                <Text style={styles.locationTitle}>Votre Position</Text>
              </View>
              <Text style={styles.locationText}>
                {userCity ? `📍 ${userCity}` : '📍 Localisation en cours...'}
              </Text>
            </View>
            
            {/* Rayon de recherche à droite */}
            <View style={styles.radiusInfo}>
              <Text style={styles.radiusLabel}>Rayon :</Text>
              <View style={styles.radiusSelector}>
                <TouchableOpacity
                  style={styles.radiusDropdown}
                  onPress={() => setShowRadiusMenu(!showRadiusMenu)}
                >
                  <Text style={styles.radiusValue}>{radiusOptions.find(opt => opt.value === searchRadius)?.label}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.primary} />
                </TouchableOpacity>
                
                {/* Menu déroulant */}
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
              </View>
            </View>
          </View>
          
          {/* Boutons d'action en dessous */}
          <View style={styles.locationActions}>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <MaterialIcons name="refresh" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section des points de recyclage */}
        <View style={styles.recyclingSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="recycling" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Points de Recyclage Proches</Text>
          </View>
          
          {/* Filtres */}
          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {availableFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    activeFilters.includes(filter.key) && styles.filterButtonActive
                  ]}
                  onPress={() => toggleFilter(filter.key)}
                >
                  <MaterialIcons 
                    name={filter.icon as any} 
                    size={16} 
                    color={activeFilters.includes(filter.key) ? colors.textInverse : filter.color} 
                  />
                  <Text style={[
                    styles.filterButtonText,
                    activeFilters.includes(filter.key) && styles.filterButtonTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {activeFilters.length > 0 && (
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                <MaterialIcons name="clear" size={16} color={colors.error} />
                <Text style={styles.clearFiltersText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Recherche des points de recyclage...</Text>
            </View>
          ) : (activeFilters.length > 0 ? filteredPoints : recyclingPoints).length > 0 ? (
            <View style={styles.pointsList}>
              {(activeFilters.length > 0 ? filteredPoints : recyclingPoints).map((point, _index) => (
                <TouchableOpacity 
                  key={point.place_id} 
                  style={styles.pointCard}
                  onPress={() => openNavigation(point)}
                >
                  <View style={styles.pointIcon}>
                    <MaterialIcons name="location-on" size={24} color={colors.success} />
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
                    <MaterialIcons name="directions" size={24} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noPointsContainer}>
              <MaterialIcons name="search-off" size={48} color={colors.textLight} />
              <Text style={styles.noPointsText}>Aucun point de recyclage trouvé</Text>
              <Text style={styles.noPointsSubtext}>
                Essayez d'élargir la zone de recherche ou vérifiez votre position
              </Text>
            </View>
          )}
        </View>

        {/* Section des actions rapides */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="camera-alt" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Scanner un déchet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="recycling" size={32} color={colors.success} />
              <Text style={styles.actionText}>Voir la collecte</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="lightbulb" size={32} color={colors.warning} />
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
    zIndex: 9999, // Z-index très élevé pour être au premier plan
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
    // No specific styles for the list, it will be handled by pointCard
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
