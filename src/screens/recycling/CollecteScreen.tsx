import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../../styles';
import Header from '../../components/common/Header';
import { CollecteInfo, CommuneSelector, WeeklyCalendar } from '../../components/common';
import { useLocation, collecteService } from '../../services';

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

  // 📍 Utiliser le service de géolocalisation
  const { city, location, getCurrentLocation } = useLocation({
    onLocationUpdate: (locationData) => {
      console.log('📍 Nouvelle localisation dans CollecteScreen:', locationData);
      if (locationData) {
        updateCollecteInfoByLocation(locationData.latitude, locationData.longitude);
      }
    },
    onError: (error) => {
      console.error('Erreur de localisation dans CollecteScreen:', error);
    },
  });

  // Charger les communes disponibles au démarrage
  useEffect(() => {
    const communes = collecteService.getAvailableCommunes();
    setAvailableCommunes(communes);
    console.log('🏘️ Communes disponibles:', communes.length);
  }, []);

  // Mettre à jour les informations de collecte par localisation
  const updateCollecteInfoByLocation = (lat: number, lon: number) => {
    try {
      const info = collecteService.getCollecteInfoByLocation(lat, lon);
      if (info) {
        setCollecteInfo(info);
        setSelectedCommune(info.commune);
        console.log('🗑️ Informations de collecte trouvées pour:', info.commune);
      } else {
        console.log('❌ Aucune information de collecte trouvée pour cette localisation');
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
      const info = collecteService.getCollecteInfo(commune);
      if (info) {
        setCollecteInfo(info);
        setSelectedCommune(commune);
        console.log('🗑️ Informations de collecte mises à jour pour:', commune);
      } else {
        console.log('❌ Aucune information de collecte trouvée pour:', commune);
        setCollecteInfo(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de collecte:', error);
    }
  };

  // Gérer le changement de commune
  const handleCommuneChange = (commune: string) => {
    updateCollecteInfoByCommune(commune);
  };

  // Charger la localisation au démarrage
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Mettre à jour les informations de collecte quand la localisation change
  useEffect(() => {
    if (location) {
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

        {/* Sélecteur de commune */}
        <CommuneSelector
          selectedCommune={selectedCommune}
          availableCommunes={availableCommunes}
          onCommuneSelect={handleCommuneChange}
          visible={showCommuneSelector}
          onClose={() => setShowCommuneSelector(false)}
        />
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
});

export default CollecteScreen;
