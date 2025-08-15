import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { Header, LocationDisplay } from '../../components/common';
import { colors } from '../../styles/colors';
import localStatsService, { UserStats } from '../../services/localStatsService';
import { useLocation } from '../../services';

interface ProfileScreenProps {
  navigation?: any;
  isAuthenticated?: boolean;
  onLoginPress?: () => void;
  onLogout?: () => void;
  onCloseModal?: () => void;
  userInfo?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  navigation: _navigation, 
  isAuthenticated: _isAuthenticated, 
  onLoginPress, 
  onLogout, 
  onCloseModal,
  userInfo: _userInfo 
}) => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // 📍 Utiliser le service de géolocalisation
  const { city, isLoading: locationLoading, getCurrentLocation } = useLocation({
    onError: (error) => console.error('Erreur de localisation:', error),
    onPermissionDenied: () => console.log('Permission de localisation refusée'),
  });

  // 🔐 Écouter les changements d'authentification Firebase
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserStats();
        // Récupérer la localisation quand l'utilisateur se connecte
        getCurrentLocation();
      } else {
        setStats(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [getCurrentLocation]);

  // 📊 Charger les statistiques utilisateur
  const loadUserStats = async () => {
    try {
      setLoading(true);
      const userStats = await localStatsService.getStats();
      setStats(userStats);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Se déconnecter
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      // Utiliser la fonction onLogout du MainNavigator si disponible
      if (onLogout) {
        onLogout();
      }
      // Fermer la modal du profil
      if (onCloseModal) {
        onCloseModal();
      }
      Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  // 🗑️ Supprimer le profil
  const handleDeleteProfile = async () => {
    Alert.alert(
      '⚠️ Suppression du Profil',
      'Êtes-vous sûr de vouloir supprimer définitivement votre profil ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Supprimer les statistiques locales
              await localStatsService.resetStats();
              // Supprimer le compte Firebase
              await user.delete();
              Alert.alert('Profil supprimé', 'Votre profil a été supprimé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la suppression du profil');
            }
          }
        }
      ]
    );
  }

  // 🎯 Afficher le niveau de l'utilisateur
  const getUserLevel = (totalPoints: number) => {
    if (totalPoints >= 1000) return { level: 'Champion', color: colors.warning, icon: 'emoji-events' };
    if (totalPoints >= 500) return { level: 'Expert', color: colors.primary, icon: 'star' };
    if (totalPoints >= 200) return { level: 'Intermédiaire', color: colors.success, icon: 'trending-up' };
    if (totalPoints >= 50) return { level: 'Débutant', color: colors.info, icon: 'person' };
    return { level: 'Nouveau', color: colors.textLight, icon: 'person-add' };
  };

  // 🏆 Afficher les statistiques
  const renderStats = () => {
    if (!stats) return null;

    const levelInfo = getUserLevel(stats.totalPoints);

    return (
      <View style={styles.statsContainer}>
        {/* 🎯 Niveau et Points */}
        <View style={styles.levelSection}>
          <View style={[styles.levelBadge, { backgroundColor: levelInfo.color }]}>
            <MaterialIcons name={levelInfo.icon as any} size={32} color="white" />
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>{levelInfo.level}</Text>
            <Text style={styles.pointsText}>{stats.totalPoints} points</Text>
            <Text style={styles.levelSubtitle}>Niveau actuel</Text>
          </View>
        </View>

        {/* 📊 Statistiques Principales */}
        <View style={styles.mainStats}>
          <View style={[styles.statCard, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
            <MaterialIcons name="camera-alt" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalScans}</Text>
            <Text style={styles.statLabel}>Scans Totaux</Text>
          </View>
          
          <View style={[styles.statCard, { borderLeftColor: colors.warning, borderLeftWidth: 4 }]}>
            <MaterialIcons name="local-fire-department" size={28} color={colors.warning} />
            <Text style={styles.statValue}>{stats.recyclingStreak}</Text>
            <Text style={styles.statLabel}>Jours Consécutifs</Text>
          </View>
          
          <View style={[styles.statCard, { borderLeftColor: colors.success, borderLeftWidth: 4 }]}>
            <MaterialIcons name="trending-up" size={28} color={colors.success} />
            <Text style={styles.statValue}>{stats.accuracyScore}%</Text>
            <Text style={styles.statLabel}>Précision</Text>
          </View>
        </View>

        {/* 🎉 Message de motivation */}
        <View style={styles.motivationSection}>
          <MaterialIcons name="emoji-events" size={24} color={colors.warning} />
          <Text style={styles.motivationText}>
            {stats.totalPoints > 100 ? (
              <>
                <MaterialIcons name="emoji-events" size={20} color={colors.warning} style={styles.inlineIcon} />
                Champion du recyclage !
              </>
            ) : stats.totalPoints > 50 ? (
              <>
                <MaterialIcons name="local-fire-department" size={20} color={colors.warning} style={styles.inlineIcon} />
                Excellent travail !
              </>
            ) : (
              <>
                <MaterialIcons name="rocket-launch" size={20} color={colors.primary} style={styles.inlineIcon} />
                Continuez comme ça !
              </>
            )}
          </Text>
        </View>

        {/* 🔄 Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={loadUserStats}>
            <MaterialIcons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Actualiser</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.resetButton]} 
            onPress={() => {
              Alert.alert(
                'Réinitialiser',
                'Voulez-vous vraiment réinitialiser toutes vos statistiques ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Réinitialiser', 
                    style: 'destructive',
                    onPress: async () => {
                      await localStatsService.resetStats();
                      loadUserStats();
                    }
                  }
                ]
              );
            }}
          >
            <MaterialIcons name="restore" size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>
              Réinitialiser
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Mon Profil" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <MaterialIcons name="hourglass-empty" size={40} color={colors.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : user ? (
          <>
            {/* 👤 Informations Utilisateur */}
            <View style={styles.userSection}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.email}</Text>
                <Text style={styles.userStatus}>Connecté</Text>
                <Text style={styles.userSubtitle}>Membre EcoTri</Text>
                {/* 📍 Affichage de la localisation */}
                <LocationDisplay 
                  city={city} 
                  isLoading={locationLoading}
                  size="small"
                />
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                  <MaterialIcons name="logout" size={20} color={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
                  <MaterialIcons name="delete-forever" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>

            {/* 📊 Statistiques */}
            {renderStats()}
          </>
        ) : (
          <View style={styles.authContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.authTitle}>Connexion Requise</Text>
            <Text style={styles.authSubtitle}>
              Connectez-vous pour voir vos statistiques !
            </Text>
            {onLoginPress && (
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={onLoginPress}
              >
                <MaterialIcons name="login" size={20} color="white" />
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  userSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },

  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  statsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 16,
    color: colors.textLight,
  },
  levelSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    width: '30%',
    paddingLeft: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  motivationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  motivationText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 10,
    flexShrink: 1,
  },
  inlineIcon: {
    marginRight: 5,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  resetButton: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  authContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});

export default ProfileScreen;
