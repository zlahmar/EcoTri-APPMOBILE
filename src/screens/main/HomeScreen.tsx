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
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'checking'>('checking');

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

  // Récupérer les points de recyclage via Overpass API (plus précis que Nominatim)
  const fetchRecyclingPoints = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      
      const delta = 0.05; // Rayon de recherche plus large (environ 5km)
      
      // Requête plus inclusive pour capturer plus de points de recyclage
      const overpassQuery = `
        [out:json];
        (
          node["amenity"="recycling"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          way["amenity"="recycling"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:glass"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:plastic"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:paper"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:metal"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:organic"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:electronics"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:clothes"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:batteries"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:oil"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:paint"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:medicines"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:printer_cartridges"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:mobile_phones"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:computers"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:white_goods"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:small_appliances"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:fluorescent_tubes"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:energy_saving_bulbs"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:car_batteries"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:engine_oil"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:cooking_oil"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:chemicals"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:ink_cartridges"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:toner_cartridges"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:plastic_bags"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:plastic_packaging"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:glass_containers"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:aluminum_cans"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:steel_cans"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:tetra_pak"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:wine_corks"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:coffee_capsules"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:tea_bags"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
          node["recycling:food_packaging"="yes"](${lat - delta},${lon - delta},${lat + delta},${lon + delta});
        );
        out;
      `;

      console.log('Requête Overpass envoyée pour:', lat, lon);

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
        console.log('Réponse Overpass reçue:', data);
        processOverpassData(data, lat, lon);
        
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
          console.log('Réponse serveur alternatif reçue:', data);
          processOverpassData(data, lat, lon);
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
  }, [calculateDistance, processOverpassData]);

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
      console.log(`${points.length} points de recyclage trouvés via Overpass`);
      
      // Si aucun point trouvé via Overpass, essayer Nominatim comme fallback
      if (points.length === 0) {
        console.log('Aucun point trouvé via Overpass, essai avec Nominatim...');
        fetchRecyclingPointsFallback(userLat, userLon);
      }
    } else {
      setRecyclingPoints([]);
      console.log('Aucun point de recyclage trouvé dans cette zone via Overpass');
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
  }, []);

  // Traduire les types de recyclage en français
  const translateRecyclingType = useCallback((tag: string): string => {
    const translations: { [key: string]: string } = {
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
      "recycling:food_packaging": "Emballages alimentaires"
    };
    
    return translations[tag] || tag.replace("recycling:", "").replace(/_/g, " ");
  }, []);

  // Demander les permissions de géolocalisation
  const requestLocationPermission = useCallback(async () => {
    try {
      setLocationPermission('checking');
      
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
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission('granted');
          // Appeler getCurrentLocation après avoir défini la permission
          setTimeout(() => {
            getCurrentLocation();
          }, 100);
        } else {
          setLocationPermission('denied');
          Alert.alert(
            'Permission refusée', 
            'Impossible de localiser les points de recyclage sans accès à la position. Vous pouvez activer la géolocalisation dans les paramètres de votre appareil.',
            [
              { text: 'OK', style: 'default' },
              { text: 'Réessayer', onPress: requestLocationPermission }
            ]
          );
        }
      } else {
        // Pour iOS, on vérifie d'abord si la permission est déjà accordée
        Geolocation.requestAuthorization('whenInUse');
        setLocationPermission('granted');
        setTimeout(() => {
          getCurrentLocation();
        }, 100);
      }
    } catch (err) {
      console.warn('Erreur lors de la demande de permission:', err);
      setLocationPermission('denied');
    }
  }, []);

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
    if (locationPermission !== 'granted') {
      requestLocationPermission();
      return;
    }

    setLoading(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lon: longitude };
        
        console.log('Position obtenue:', location);
        setUserLocation(location);
        
        // Récupérer le nom de la ville
        fetchCityFromCoordinates(latitude, longitude);
        
        // Récupérer les points de recyclage
        fetchRecyclingPoints(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setLoading(false);
        
        let errorMessage = 'Impossible d\'obtenir votre position';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Permission de géolocalisation refusée';
            setLocationPermission('denied');
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Position temporairement indisponible';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Délai de géolocalisation dépassé';
            break;
        }
        
        Alert.alert('Erreur de géolocalisation', errorMessage, [
          { text: 'OK', style: 'default' },
          { text: 'Réessayer', onPress: getCurrentLocation }
        ]);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 10, // Mise à jour si déplacement > 10m
      }
    );
  }, [locationPermission, requestLocationPermission, fetchRecyclingPoints, fetchCityFromCoordinates]);

  // Demander la géolocalisation au démarrage
  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

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
          <MaterialIcons name="eco" size={40} color={colors.primary} />
          <Text style={styles.welcomeTitle}>Bienvenue sur EcoTri ! 🌱</Text>
          <Text style={styles.welcomeSubtitle}>
            Découvrez les points de recyclage près de chez vous
          </Text>
        </View>

        {/* Section de géolocalisation */}
        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <MaterialIcons name="location-on" size={24} color={colors.primary} />
            <Text style={styles.locationTitle}>Votre position</Text>
          </View>
          
          {userLocation ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                📍 {userCity || 'Détection de la ville...'}
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                <MaterialIcons name="refresh" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              <MaterialIcons name="my-location" size={20} color={colors.primary} />
              <Text style={styles.locationButtonText}>Activer la géolocalisation</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section des points de recyclage */}
        <View style={styles.recyclingSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="recycling" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Points de Recyclage Proches</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Recherche des points de recyclage...</Text>
            </View>
          ) : recyclingPoints.length > 0 ? (
            <View style={styles.pointsList}>
              {recyclingPoints.map((point, _index) => (
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
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  locationSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
  },
  refreshButton: {
    padding: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  locationButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  recyclingSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textLight,
  },
  pointsList: {
    // No specific styles for the list, it will be handled by pointCard
  },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pointIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pointInfo: {
    flex: 1,
  },
  pointName: {
    fontSize: 16,
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
    fontSize: 12,
    color: colors.textLight,
  },
  pointAction: {
    paddingLeft: 16,
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
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%', // Two columns
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
  },
});

export default HomeScreen;
