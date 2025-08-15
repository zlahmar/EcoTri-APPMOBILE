import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import { CollecteInfo } from '../../services';

interface CollecteInfoProps {
  collecteInfo: CollecteInfo | null;
  onCommuneChange?: () => void;
  showCommuneSelector?: boolean;
}

const CollecteInfoComponent: React.FC<CollecteInfoProps> = ({
  collecteInfo,
  onCommuneChange,
  showCommuneSelector = false,
}) => {
  if (!collecteInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="info" size={24} color={colors.warning} />
          <Text style={styles.title}>Informations de collecte</Text>
        </View>
        <Text style={styles.noDataText}>
          Aucune information de collecte disponible pour cette zone.
        </Text>
      </View>
    );
  }

  const formatPassage = (passage: 'JOUR' | 'NUIT') => {
    return passage === 'JOUR' ? 'En journée' : 'En soirée/Nuit';
  };

  const getNextCollecte = (jours: string[]) => {
    if (jours.length === 0) return null;
    
    const today = new Date();
    const todayName = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'][today.getDay()];
    
    if (jours.includes(todayName)) {
      return 'Aujourd\'hui';
    }
    
    const joursOrdre = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
    const todayIndex = joursOrdre.indexOf(todayName);
    
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (todayIndex + i) % 7;
      const nextDay = joursOrdre[nextIndex];
      
      if (jours.includes(nextDay)) {
        const traductions: { [key: string]: string } = {
          'LUNDI': 'Lundi',
          'MARDI': 'Mardi',
          'MERCREDI': 'Mercredi',
          'JEUDI': 'Jeudi',
          'VENDREDI': 'Vendredi',
          'SAMEDI': 'Samedi',
          'DIMANCHE': 'Dimanche'
        };
        return traductions[nextDay];
      }
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="delete" size={24} color={colors.primary} />
        <Text style={styles.title}>Collecte des déchets</Text>
        {showCommuneSelector && onCommuneChange && (
          <TouchableOpacity onPress={onCommuneChange} style={styles.changeButton}>
            <MaterialIcons name="edit-location" size={20} color={colors.primary} />
            <Text style={styles.changeButtonText}>Changer</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.communeInfo}>
        <MaterialIcons name="location-city" size={16} color={colors.text} />
        <Text style={styles.communeName}>{collecteInfo.commune}</Text>
      </View>

      <View style={styles.collecteSection}>
        {/* Ordures Ménagères */}
        <View style={styles.collecteType}>
          <View style={styles.typeHeader}>
            <MaterialIcons name="delete" size={20} color={colors.error} />
            <Text style={styles.typeTitle}>Ordures Ménagères</Text>
          </View>
          
          {collecteInfo.orduresMenageres.jours.length > 0 ? (
            <>
              <Text style={styles.daysText}>
                {collecteInfo.orduresMenageres.jours.map(jour => {
                  const traductions: { [key: string]: string } = {
                    'LUNDI': 'Lundi',
                    'MARDI': 'Mardi',
                    'MERCREDI': 'Mercredi',
                    'JEUDI': 'Jeudi',
                    'VENDREDI': 'Vendredi',
                    'SAMEDI': 'Samedi',
                    'DIMANCHE': 'Dimanche'
                  };
                  return traductions[jour] || jour;
                }).join(', ')}
              </Text>
              <Text style={styles.passageText}>
                {formatPassage(collecteInfo.orduresMenageres.passage)}
              </Text>
              {getNextCollecte(collecteInfo.orduresMenageres.jours) && (
                <View style={styles.nextCollecte}>
                  <MaterialIcons name="schedule" size={16} color={colors.success} />
                  <Text style={styles.nextCollecteText}>
                    Prochaine collecte : {getNextCollecte(collecteInfo.orduresMenageres.jours)}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.noCollecteText}>Aucune collecte programmée</Text>
          )}
        </View>

        {/* Tri et Recyclage */}
        <View style={styles.collecteType}>
          <View style={styles.typeHeader}>
            <MaterialIcons name="recycling" size={20} color={colors.success} />
            <Text style={styles.typeTitle}>Tri et Recyclage</Text>
          </View>
          
          {collecteInfo.triRecyclage.jours.length > 0 ? (
            <>
              <Text style={styles.daysText}>
                {collecteInfo.triRecyclage.jours.map(jour => {
                  const traductions: { [key: string]: string } = {
                    'LUNDI': 'Lundi',
                    'MARDI': 'Mardi',
                    'MERCREDI': 'Mercredi',
                    'JEUDI': 'Jeudi',
                    'VENDREDI': 'Vendredi',
                    'SAMEDI': 'Samedi',
                    'DIMANCHE': 'Dimanche'
                  };
                  return traductions[jour] || jour;
                }).join(', ')}
              </Text>
              <Text style={styles.passageText}>
                {formatPassage(collecteInfo.triRecyclage.passage)}
              </Text>
              {getNextCollecte(collecteInfo.triRecyclage.jours) && (
                <View style={styles.nextCollecte}>
                  <MaterialIcons name="schedule" size={16} color={colors.success} />
                  <Text style={styles.nextCollecteText}>
                    Prochaine collecte : {getNextCollecte(collecteInfo.triRecyclage.jours)}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.noCollecteText}>Aucune collecte programmée</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  changeButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  communeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  communeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  collecteSection: {
    gap: 16,
  },
  collecteType: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  daysText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  passageText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  nextCollecte: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  nextCollecteText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  noCollecteText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CollecteInfoComponent;
