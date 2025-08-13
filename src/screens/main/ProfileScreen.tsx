import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../styles';
import { Header } from '../../components/common';

interface ProfileScreenProps {
  isAuthenticated: boolean;
  onLoginPress: () => void;
  onLogout: () => void;
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  isAuthenticated, 
  onLoginPress, 
  onLogout,
  userInfo 
}) => {
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profil" />
        
        <View style={styles.authContainer}>
          <View style={styles.logoSection}>
            <Text style={styles.logo}>🌱</Text>
            <Text style={styles.title}>Accédez à votre profil</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour voir vos statistiques et gérer vos informations
            </Text>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Fonctionnalités du profil :</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Statistiques personnalisées</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureText}>Suivi de vos progrès</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚙️</Text>
              <Text style={styles.featureText}>Paramètres personnalisés</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informations utilisateur */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>
            {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Utilisateur EcoTri'}
          </Text>
          <Text style={styles.userEmail}>
            {userInfo?.email || 'user@ecotri.com'}
          </Text>
        </View>

        {/* Statistiques */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
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
              <Text style={styles.statLabel}>Niveau</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>150</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        {/* Informations de l'app */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              EcoTri - Application de recyclage intelligent
            </Text>
            <Text style={styles.infoText}>
              Version 2.1.0 - Master 2 YNOV
            </Text>
            <Text style={styles.infoText}>
              Développée avec React Native et Firebase
            </Text>
          </View>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
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
    paddingHorizontal: 16,
  },
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textLight,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
