import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, Alert } from 'react-native';
import { colors } from '../styles';
import ProfileScreen from '../screens/main/ProfileScreen';
import { ScanScreen, CollecteScreen, ConseilsScreen } from '../screens/recycling';
import AuthScreen from '../screens/auth/AuthScreen';
import authService, { UserData } from '../services/authService';

const MainNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('scan');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  // Écouter les changements d'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await authService.getUserData(user.uid);
          setUserInfo(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          // L'utilisateur est connecté mais on ne peut pas récupérer ses données
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (userData?: UserData) => {
    if (userData) {
      setUserInfo(userData);
    }
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const handleLoginPress = () => {
    setShowAuthModal(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'scan':
        return <ScanScreen />;
      case 'collecte':
        return <CollecteScreen />;
      case 'profile':
        return (
          <ProfileScreen
            isAuthenticated={isAuthenticated}
            onLoginPress={handleLoginPress}
            onLogout={handleLogout}
            userInfo={userInfo || undefined}
          />
        );
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

      {/* Modal d'authentification */}
      <Modal
        visible={showAuthModal}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowAuthModal(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        </SafeAreaView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

export default MainNavigator;
