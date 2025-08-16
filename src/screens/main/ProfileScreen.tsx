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
import { Avatar } from '@kolking/react-native-avatar';
import { Header, UserGuide } from '../../components/common';
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
  const [showUserGuide, setShowUserGuide] = useState(false);

  //  Utilisation du service de géolocalisation
  const { city, getCurrentLocation } = useLocation({
    onError: (error) => console.error('Erreur de localisation:', error),
    onPermissionDenied: () => console.log('Permission de localisation refusée'),
  });

  //  Écoute des changements d'authentification Firebase
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserStats();
        getCurrentLocation();
      } else {
        setStats(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [getCurrentLocation]);

  //  Chargement des statistiques utilisateur
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

  //  Déconnexion
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      if (onLogout) {
        onLogout();
      }
      if (onCloseModal) {
        onCloseModal();
      }
      Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  //  Suppression du profil
  const handleDeleteProfile = async () => {
    Alert.alert(
      ' Suppression du Profil',
      'Êtes-vous sûr de vouloir supprimer définitivement votre profil ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await localStatsService.resetStats();
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

  //  Composant StatCard
  const StatCard = ({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <MaterialIcons name={icon as any} size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const getMotivationalQuote = (_totalPoints: number) => {
    const quotes = [
      "Chaque geste compte 🌍",
      "Le recyclage, c'est l'avenir ♻️",
      "Tu fais la différence 💪",
      "Continue comme ça ! 🚀",
      "Un champion du recyclage ! 🏆"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  //  Génération du badge selon le niveau
  const getUserLevelBadge = (totalPoints: number) => {
    if (totalPoints >= 1000) return '🏆'; // Champion
    if (totalPoints >= 500) return '⭐'; // Expert
    if (totalPoints >= 200) return '📈'; // Intermédiaire
    if (totalPoints >= 100) return '🌱'; // Débutant
    if (totalPoints >= 50) return '🌱'; // Nouveau
    return '';
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.userInfoSection}>
          <View style={styles.userMainInfo}>
            <View style={styles.userAvatar}>
              <Avatar
                size={50}
                name={user?.email?.split('@')[0] || 'U'}
                email={user?.email}
                colorize={true}
                radius={25}
                badge={getUserLevelBadge(stats.totalPoints)}
              />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userStatus}>Membre EcoTri</Text>
              <View style={styles.pointsRow}>
                <MaterialIcons name="star" size={16} color={colors.warning} />
                <Text style={styles.pointsText}>{stats.totalPoints} points</Text>
              </View>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={16} color={colors.textLight} />
                <Text style={styles.locationText}>{city || 'Localisation...'}</Text>
              </View>
            </View>
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

        <View style={styles.mainStats}>
          <StatCard icon="camera-alt" value={stats.totalScans} label="Scans Totaux" color={colors.primary} />
          
          <StatCard icon="local-fire-department" value={stats.recyclingStreak} label="Jours Consécutifs" color={colors.warning} />
          
          <StatCard icon="trending-up" value={stats.accuracyScore + "%"} label="Précision" color={colors.success} />
        </View>

        <View style={styles.recyclingSearchSection}>
          <StatCard icon="search" value={stats.recyclingPointSearches || 0} label="Recherches de Points" color={colors.info} />
          {stats.lastRecyclingSearch && (
            <Text style={styles.lastSearchText}>
              Dernière: {new Date(stats.lastRecyclingSearch).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>

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
          <Text style={styles.quoteText}>{getMotivationalQuote(stats.totalPoints)}</Text>
          
          <TouchableOpacity 
            style={styles.guideButton} 
            onPress={() => setShowUserGuide(true)}
          >
            <MaterialIcons name="help-outline" size={20} color={colors.primary} />
            <Text style={styles.guideButtonText}>Guide d'Utilisation</Text>
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
      {showUserGuide && <UserGuide isVisible={showUserGuide} onClose={() => setShowUserGuide(false)} />}
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

  statsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  userInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 80,
  },
  userMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 5,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  
  signOutButton: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  levelSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    width: '30%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  recyclingSearchSection: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  lastSearchText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  motivationSection: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 0,
    flexShrink: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  inlineIcon: {
    marginRight: 5,
  },
  quoteText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
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
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guideButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },

});

export default ProfileScreen;
