import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { colors } from '../../styles';
import { Header } from '../../components/common';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const menuItems = [
    {
      id: 'scanner',
      title: 'Scanner',
      subtitle: 'Reconnaître les déchets',
      icon: '📱',
      color: colors.plastic,
      route: 'Scanner',
    },
    {
      id: 'map',
      title: 'Carte',
      subtitle: 'Centres de recyclage',
      icon: '🗺️',
      color: colors.glass,
      route: 'Map',
    },
    {
      id: 'advice',
      title: 'Conseils',
      subtitle: 'Guide de recyclage',
      icon: '💡',
      color: colors.paper,
      route: 'Advice',
    },
    {
      id: 'collection',
      title: 'Collecte',
      subtitle: 'Planning des ramassages',
      icon: '🗓️',
      color: colors.metal,
      route: 'Collection',
    },
    {
      id: 'profile',
      title: 'Profil',
      subtitle: 'Statistiques & niveau',
      icon: '👤',
      color: colors.organic,
      route: 'Profile',
    },
    {
      id: 'guide',
      title: 'Guide',
      subtitle: 'Base de connaissances',
      icon: '📚',
      color: colors.electronic,
      route: 'Guide',
    },
  ];

  const handleMenuPress = (route: string) => {
    // Navigation vers l'écran correspondant
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="EcoTri" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section de bienvenue */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bonjour ! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Prêt à recycler intelligemment ?
          </Text>
        </View>

        {/* Statistiques rapides */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Déchets scannés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Taux de recyclage</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Niveau actuel</Text>
          </View>
        </View>

        {/* Menu principal */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { borderLeftColor: item.color }]}
                onPress={() => handleMenuPress(item.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conseil du jour */}
        <View style={styles.tipSection}>
          <Text style={styles.sectionTitle}>💡 Conseil du jour</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              "Les bouteilles en plastique transparent sont plus facilement recyclables que celles colorées. Privilégiez-les lors de vos achats !"
            </Text>
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
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
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
  menuIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  tipSection: {
    marginBottom: 32,
  },
  tipCard: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
