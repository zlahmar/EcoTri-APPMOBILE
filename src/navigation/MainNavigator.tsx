import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { ScanScreen, CollecteScreen, ConseilsScreen } from '../screens/recycling';

const MainNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('scan');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'scan':
        return <ScanScreen />;
      case 'collecte':
        return <CollecteScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'conseils':
        return <ConseilsScreen />;
      default:
        return <ScanScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Contenu de l'écran */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Barre de navigation personnalisée */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'scan' && styles.activeTab]}
          onPress={() => setCurrentScreen('scan')}
        >
          <Text style={[styles.tabText, currentScreen === 'scan' && styles.activeTabText]}>
            📱 Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentScreen === 'collecte' && styles.activeTab]}
          onPress={() => setCurrentScreen('collecte')}
        >
          <Text style={[styles.tabText, currentScreen === 'collecte' && styles.activeTabText]}>
            ♻️ Collecte
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentScreen === 'profile' && styles.activeTab]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>
            👤 Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentScreen === 'conseils' && styles.activeTab]}
          onPress={() => setCurrentScreen('conseils')}
        >
          <Text style={[styles.tabText, currentScreen === 'conseils' && styles.activeTabText]}>
            💡 Conseils
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default MainNavigator;
