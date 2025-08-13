import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../../styles';
import Header from '../../components/common/Header';

const CollecteScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Collecte & Recyclage" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistiques de collecte */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Vos Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Déchets Scannés</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Recyclés</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>En Attente</Text>
            </View>
          </View>
        </View>

        {/* Types de déchets */}
        <View style={styles.wasteTypesSection}>
          <Text style={styles.sectionTitle}>Types de Déchets</Text>
          <View style={styles.wasteTypeItem}>
            <View style={[styles.wasteIcon, { backgroundColor: colors.plastic }]}>
              <Text style={styles.wasteIconText}>🥤</Text>
            </View>
            <View style={styles.wasteInfo}>
              <Text style={styles.wasteName}>Plastique</Text>
              <Text style={styles.wasteCount}>8 déchets</Text>
            </View>
            <TouchableOpacity style={styles.collectButton}>
              <Text style={styles.collectButtonText}>Collecter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wasteTypeItem}>
            <View style={[styles.wasteIcon, { backgroundColor: colors.paper }]}>
              <Text style={styles.wasteIconText}>📄</Text>
            </View>
            <View style={styles.wasteInfo}>
              <Text style={styles.wasteName}>Papier</Text>
              <Text style={styles.wasteCount}>6 déchets</Text>
            </View>
            <TouchableOpacity style={styles.collectButton}>
              <Text style={styles.collectButtonText}>Collecter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wasteTypeItem}>
            <View style={[styles.wasteIcon, { backgroundColor: colors.glass }]}>
              <Text style={styles.wasteIconText}>🍷</Text>
            </View>
            <View style={styles.wasteInfo}>
              <Text style={styles.wasteName}>Verre</Text>
              <Text style={styles.wasteCount}>4 déchets</Text>
            </View>
            <TouchableOpacity style={styles.collectButton}>
              <Text style={styles.collectButtonText}>Collecter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wasteTypeItem}>
            <View style={[styles.wasteIcon, { backgroundColor: colors.metal }]}>
              <Text style={styles.wasteIconText}>🥫</Text>
            </View>
            <View style={styles.wasteInfo}>
              <Text style={styles.wasteName}>Métal</Text>
              <Text style={styles.wasteCount}>6 déchets</Text>
            </View>
            <TouchableOpacity style={styles.collectButton}>
              <Text style={styles.collectButtonText}>Collecter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Centres de recyclage */}
        <View style={styles.centersSection}>
          <Text style={styles.sectionTitle}>Centres de Recyclage Proches</Text>
          <TouchableOpacity style={styles.centerCard}>
            <Text style={styles.centerName}>♻️ ÉcoPoint Centre</Text>
            <Text style={styles.centerAddress}>123 Rue de l'Écologie, Paris</Text>
            <Text style={styles.centerDistance}>À 0.8 km de chez vous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.centerCard}>
            <Text style={styles.centerName}>♻️ Recyclage Express</Text>
            <Text style={styles.centerAddress}>456 Avenue Verte, Paris</Text>
            <Text style={styles.centerDistance}>À 1.2 km de chez vous</Text>
          </TouchableOpacity>
        </View>

        {/* Bouton d'action principal */}
        <TouchableOpacity style={styles.mainActionButton}>
          <Text style={styles.mainActionButtonText}>📱 Scanner un Nouveau Déchet</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  statsSection: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  wasteTypesSection: {
    marginBottom: 25,
  },
  wasteTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  wasteIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  wasteIconText: {
    fontSize: 24,
  },
  wasteInfo: {
    flex: 1,
  },
  wasteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  wasteCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  collectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  collectButtonText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  centersSection: {
    marginBottom: 25,
  },
  centerCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  centerAddress: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 3,
  },
  centerDistance: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  mainActionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  mainActionButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollecteScreen;
