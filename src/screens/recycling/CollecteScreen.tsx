import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../../styles';
import Header from '../../components/common/Header';
import { CollecteInfo, CommuneSelector, WeeklyCalendar } from '../../components/common';
import { useLocation, collecteService } from '../../services';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CollecteScreen = ({ 
  isAuthenticated = false, 
  onProfilePress, 
  userInfo: _userInfo 
}: { 
  isAuthenticated?: boolean; 
  onProfilePress?: () => void; 
  userInfo?: any; 
}) => {
  const [selectedCommune, setSelectedCommune] = useState<string>('');
  const [collecteInfo, setCollecteInfo] = useState<any>(null);
  const [showCommuneSelector, setShowCommuneSelector] = useState(false);
  const [availableCommunes, setAvailableCommunes] = useState<string[]>([]);

  // Utilisation du service de géolocalisation
  const { city, location, getCurrentLocation } = useLocation({
    onLocationUpdate: (locationData) => {
      console.log('Nouvelle localisation dans CollecteScreen:', locationData);
      if (locationData) {
        updateCollecteInfoByLocation(locationData.latitude, locationData.longitude);
      }
    },
    onError: (error) => {
      console.error('Erreur de localisation dans CollecteScreen:', error);
    },
  });

  // Chargement des communes disponibles au démarrage
  useEffect(() => {
    console.log(' Début du chargement des communes...');
    console.log(' collecteService disponible:', !!collecteService);
    
    try {
      console.log(' Test du service - getAvailableCommunes appelé');
      const communes = collecteService.getAvailableCommunes();
      console.log(' Communes récupérées du service:', communes);
      console.log(' Nombre de communes:', communes.length);
      console.log(' Type des communes:', typeof communes);
      console.log(' Est-ce un array?', Array.isArray(communes));
      
      if (Array.isArray(communes) && communes.length > 0) {
        console.log(' Premières communes:', communes.slice(0, 5));
        setAvailableCommunes(communes);
      } else {
        console.log(' Aucune commune trouvée ou format incorrect');
        setAvailableCommunes([]);
      }
    } catch (error) {
      console.error(' Erreur lors du chargement des communes:', error);
      setAvailableCommunes([]);
    }
  }, []);

  // Mettre à jour les informations de collecte par localisation
  const updateCollecteInfoByLocation = (lat: number, lon: number) => {
    try {
      console.log(' Tentative de mise à jour par localisation:', { lat, lon });
      const info = collecteService.getCollecteInfoByLocation(lat, lon);
      console.log(' Info récupérée:', info);
      if (info) {
        setCollecteInfo(info);
        setSelectedCommune(info.commune);
        console.log(' Informations de collecte trouvées pour:', info.commune);
      } else {
        console.log(' Aucune information de collecte trouvée pour cette localisation');
        setCollecteInfo(null);
        setSelectedCommune('');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de collecte:', error);
    }
  };

  // Mettre à jour les informations de collecte par commune sélectionnée
  const updateCollecteInfoByCommune = (commune: string) => {
    try {
      console.log(' Tentative de mise à jour par commune:', commune);
      const info = collecteService.getCollecteInfo(commune);
      if (info) {
        setCollecteInfo(info);
        setSelectedCommune(commune);
        console.log(' Informations de collecte mises à jour pour:', commune);
      } else {
        console.log(' Aucune information de collecte trouvée pour:', commune);
        setCollecteInfo(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de collecte:', error);
    }
  };

  const handleCommuneChange = (commune: string) => {
    console.log('Changement de commune sélectionnée:', commune);
    updateCollecteInfoByCommune(commune);
  };

  useEffect(() => {
    console.log(' Démarrage de la localisation...');
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (location) {
      console.log(' Nouvelle localisation détectée:', location);
      updateCollecteInfoByLocation(location.latitude, location.longitude);
    }
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Calendrier de Collecte" 
        showProfileIcon={true}
        isAuthenticated={isAuthenticated} 
        onProfilePress={onProfilePress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informations de collecte */}
        <View style={styles.collecteSection}>
          
          {collecteInfo ? (
            <>
              <CollecteInfo
                collecteInfo={collecteInfo}
                onCommuneChange={() => setShowCommuneSelector(true)}
                showCommuneSelector={true}
              />
              
              {/* Calendrier hebdomadaire */}
              <WeeklyCalendar collecteInfo={collecteInfo} />
              
              {/* Source des données */}
              <View style={styles.sourceContainer}>
                <MaterialIcons name="info-outline" size={16} color={colors.textLight} />
                <Text style={styles.sourceText}>
                  Source : Bordeaux Métropole - Données de collecte des déchets
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {city ? `Aucune information de collecte disponible pour ${city}` : 'Localisation en cours...'}
              </Text>
              <TouchableOpacity 
                style={styles.selectCommuneButton}
                onPress={() => setShowCommuneSelector(true)}
              >
                <Text style={styles.selectCommuneButtonText}>Sélectionner une commune</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <CommuneSelector
        selectedCommune={selectedCommune}
        availableCommunes={availableCommunes}
        onCommuneSelect={handleCommuneChange}
        visible={showCommuneSelector}
        onClose={() => setShowCommuneSelector(false)}
      />
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
    padding: 20,
  },

  collecteSection: {
    marginBottom: 25,
  },
  noDataContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 15,
  },
  selectCommuneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  selectCommuneButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sourceContainer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sourceText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginLeft: 5,
  },
});

export default CollecteScreen;
