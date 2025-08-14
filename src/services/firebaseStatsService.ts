import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserStats, ScanResult } from './statsService';

class FirebaseStatsService {
  private readonly COLLECTION_USERS = 'users';
  private readonly COLLECTION_STATS = 'userStats';
  private readonly COLLECTION_SCAN_HISTORY = 'scanHistory';

  // 🎯 Points par scan réussi
  private readonly POINTS_PER_SCAN = 10;
  private readonly BONUS_POINTS_HIGH_CONFIDENCE = 5; // Bonus si confiance > 80%
  private readonly STREAK_BONUS = 2; // Bonus par jour consécutif

  // 🔐 Obtenir l'ID de l'utilisateur connecté
  private getCurrentUserId(): string | null {
    const user = auth().currentUser;
    return user?.uid || null;
  }

  // 📊 Initialiser les statistiques pour un nouvel utilisateur
  async initializeStats(): Promise<UserStats> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      // Vérifier si les stats existent déjà
      const existingStats = await this.getStats();
      if (existingStats) {
        return existingStats;
      }

      // Créer des stats par défaut
      const defaultStats: UserStats = {
        totalScans: 0,
        totalPoints: 0,
        scansThisWeek: 0,
        scansThisMonth: 0,
        lastScanDate: null,
        recyclingStreak: 0,
        wasteTypesScanned: {},
        accuracyScore: 0,
      };

      // Sauvegarder dans Firestore
      await firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current')
        .set(defaultStats);

      return defaultStats;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des stats Firebase:', error);
      throw error;
    }
  }

  // 🎯 Ajouter un scan et calculer les points
  async addScan(wasteType: string, confidence: number): Promise<{
    pointsEarned: number;
    newStats: UserStats;
    message: string;
  }> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const currentStats = await this.getStats();
      if (!currentStats) {
        throw new Error('Statistiques non initialisées');
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // 🎯 Calculer les points
      let pointsEarned = this.POINTS_PER_SCAN;
      
      // Bonus pour haute confiance
      if (confidence > 0.8) {
        pointsEarned += this.BONUS_POINTS_HIGH_CONFIDENCE;
      }

      // Bonus pour streak
      if (currentStats.recyclingStreak > 0) {
        pointsEarned += Math.min(currentStats.recyclingStreak * this.STREAK_BONUS, 10);
      }

      // 📊 Mettre à jour les statistiques
      const newStats: UserStats = {
        ...currentStats,
        totalScans: currentStats.totalScans + 1,
        totalPoints: currentStats.totalPoints + pointsEarned,
        lastScanDate: today,
        wasteTypesScanned: {
          ...currentStats.wasteTypesScanned,
          [wasteType]: (currentStats.wasteTypesScanned[wasteType] || 0) + 1,
        },
      };

      // 🗓️ Mettre à jour les scans de la semaine/mois
      newStats.scansThisWeek = await this.calculateWeeklyScans();
      newStats.scansThisMonth = await this.calculateMonthlyScans();

      // 🔥 Mettre à jour le streak
      newStats.recyclingStreak = await this.calculateStreak(today, currentStats.lastScanDate);

      // 📈 Mettre à jour le score de précision
      newStats.accuracyScore = await this.calculateAccuracyScore();

      // 💾 Sauvegarder dans Firestore (avec support offline)
      const batch = firestore().batch();
      
      // Mettre à jour les stats
      const statsRef = firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current');
      
      batch.set(statsRef, newStats);

      // Ajouter à l'historique
      const historyRef = firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_SCAN_HISTORY)
        .doc();

      const scanRecord: ScanResult = {
        timestamp: now.toISOString(),
        points: pointsEarned,
        wasteType,
        confidence,
      };

      batch.set(historyRef, scanRecord);

      // Exécuter le batch
      await batch.commit();

      // 🎉 Message de motivation
      const message = this.generateMotivationalMessage(pointsEarned, newStats);

      return {
        pointsEarned,
        newStats,
        message,
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du scan Firebase:', error);
      throw error;
    }
  }

  // 📊 Obtenir les statistiques actuelles
  async getStats(): Promise<UserStats | null> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return null;
      }

      const statsDoc = await firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current')
        .get();

      if (statsDoc.exists) {
        return statsDoc.data() as UserStats;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats Firebase:', error);
      return null;
    }
  }

  // 🗓️ Calculer les scans de la semaine
  private async calculateWeeklyScans(): Promise<number> {
    try {
      const history = await this.getScanHistory();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      return history.filter(scan => 
        new Date(scan.timestamp) > oneWeekAgo
      ).length;
    } catch (error) {
      return 0;
    }
  }

  // 🗓️ Calculer les scans du mois
  private async calculateMonthlyScans(): Promise<number> {
    try {
      const history = await this.getScanHistory();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      return history.filter(scan => 
        new Date(scan.timestamp) > oneMonthAgo
      ).length;
    } catch (error) {
      return 0;
    }
  }

  // 🔥 Calculer le streak de recyclage
  private async calculateStreak(today: string, lastScanDate: string | null): Promise<number> {
    if (!lastScanDate) return 1;

    const lastScan = new Date(lastScanDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastScan.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Scan consécutif
      const currentStats = await this.getStats();
      return (currentStats?.recyclingStreak || 0) + 1;
    } else if (diffDays === 0) {
      // Même jour, garder le streak
      const currentStats = await this.getStats();
      return currentStats?.recyclingStreak || 0;
    } else {
      // Streak brisé
      return 1;
    }
  }

  // 📈 Calculer le score de précision moyen
  private async calculateAccuracyScore(): Promise<number> {
    try {
      const history = await this.getScanHistory();
      if (history.length === 0) return 0;

      const totalConfidence = history.reduce((sum, scan) => sum + scan.confidence, 0);
      return Math.round((totalConfidence / history.length) * 100);
    } catch (error) {
      return 0;
    }
  }

  // 📚 Obtenir l'historique des scans
  async getScanHistory(): Promise<ScanResult[]> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return [];
      }

      const historySnapshot = await firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_SCAN_HISTORY)
        .orderBy('timestamp', 'desc')
        .limit(100) // Limiter à 100 derniers scans
        .get();

      return historySnapshot.docs.map(doc => doc.data() as ScanResult);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique Firebase:', error);
      return [];
    }
  }

  // 🎉 Générer un message de motivation
  private generateMotivationalMessage(pointsEarned: number, stats: UserStats): string {
    const messages = [
      `🎉 +${pointsEarned} points ! Excellent recyclage !`,
      `♻️ Bravo ! Vous avez maintenant ${stats.totalPoints} points !`,
      `🔥 Streak de ${stats.recyclingStreak} jours ! Continuez !`,
      `📊 ${stats.totalScans} déchets recyclés ! Vous êtes un champion !`,
      `🌟 Score de précision : ${stats.accuracyScore}% ! Impressionnant !`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // 🏆 Obtenir les classements (pour comparaison avec d'autres utilisateurs)
  async getLeaderboard(): Promise<{
    totalPoints: number;
    totalScans: number;
    recyclingStreak: number;
    accuracyScore: number;
    rank?: number; // Position dans le classement
  }> {
    const stats = await this.getStats();
    if (!stats) {
      return { totalPoints: 0, totalScans: 0, recyclingStreak: 0, accuracyScore: 0 };
    }

    // Calculer le rang (optionnel - pour les classements)
    const rank = await this.calculateUserRank(stats.totalPoints);

    return {
      totalPoints: stats.totalPoints,
      totalScans: stats.totalScans,
      recyclingStreak: stats.recyclingStreak,
      accuracyScore: stats.accuracyScore,
      rank,
    };
  }

  // 🏅 Calculer le rang de l'utilisateur
  private async calculateUserRank(userPoints: number): Promise<number | undefined> {
    try {
      const usersSnapshot = await firestore()
        .collectionGroup(this.COLLECTION_STATS)
        .orderBy('totalPoints', 'desc')
        .get();

      let rank = 1;
      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        if (userData.totalPoints === userPoints) {
          return rank;
        }
        rank++;
      }

      return undefined;
    } catch (error) {
      console.error('Erreur lors du calcul du rang:', error);
      return undefined;
    }
  }

  // 🔄 Réinitialiser les statistiques (pour les tests)
  async resetStats(): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      // Supprimer les stats et l'historique
      const batch = firestore().batch();
      
      // Supprimer les stats
      const statsRef = firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current');
      
      batch.delete(statsRef);

      // Supprimer l'historique
      const historySnapshot = await firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_SCAN_HISTORY)
        .get();

      historySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Réinitialiser
      await this.initializeStats();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation Firebase:', error);
    }
  }

  // 📱 Écouter les changements en temps réel
  onStatsChange(callback: (stats: UserStats | null) => void) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      callback(null);
      return () => {};
    }

    return firestore()
      .collection(this.COLLECTION_USERS)
      .doc(userId)
      .collection(this.COLLECTION_STATS)
      .doc('current')
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data() as UserStats);
        } else {
          callback(null);
        }
      });
  }
}

export default new FirebaseStatsService();
