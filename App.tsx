import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'react-native';
import SplashScreen from './src/screens/main/SplashScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'profile'>('splash');
  const [isLoading, setIsLoading] = useState(true);

  const handleFinish = () => {
    setIsLoading(false);
    setCurrentScreen('home');
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleFinish} />;
  }

  const renderHomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 EcoTri</Text>
        <Text style={styles.subtitle}>Application de Recyclage Intelligent</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>♻️ Scanner de Produits</Text>
          <Text style={styles.cardText}>Scannez les codes-barres pour identifier les produits recyclables</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🗺️ Points de Recyclage</Text>
          <Text style={styles.cardText}>Trouvez les centres de recyclage près de chez vous</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Impact Environnemental</Text>
          <Text style={styles.cardText}>Suivez votre contribution à la protection de l'environnement</Text>
        </View>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'home' && styles.activeTab]} 
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.tabText}>🏠 Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'profile' && styles.activeTab]} 
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={styles.tabText}>👤 Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Mon Profil</Text>
        <Text style={styles.subtitle}>Gérez vos informations et préférences</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Informations Personnelles</Text>
          <Text style={styles.cardText}>Nom: Utilisateur EcoTri</Text>
          <Text style={styles.cardText}>Email: user@ecotri.com</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏆 Statistiques</Text>
          <Text style={styles.cardText}>Produits recyclés: 42</Text>
          <Text style={styles.cardText}>CO2 économisé: 12.5 kg</Text>
        </View>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'home' && styles.activeTab]} 
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.tabText}>🏠 Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'profile' && styles.activeTab]} 
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={styles.tabText}>👤 Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2E5A3C" />
      {currentScreen === 'home' ? renderHomeScreen() : renderProfileScreen()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CB593',
  },
  header: {
    backgroundColor: '#2E5A3C',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5A3C',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#2E5A3C',
    fontWeight: '500',
  },
});
