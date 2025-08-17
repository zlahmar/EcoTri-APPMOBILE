import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserStats, ScanResult } from './statsService';

class FirebaseStatsService {
  private readonly COLLECTION_USERS = 'users';
  private readonly COLLECTION_STATS = 'userStats';
  private readonly COLLECTION_SCAN_HISTORY = 'scanHistory';

  private readonly POINTS_PER_SCAN = 10;
  private readonly BONUS_POINTS_HIGH_CONFIDENCE = 5;
  private readonly STREAK_BONUS = 2;

  private getCurrentUserId(): string | null {
    const user = auth().currentUser;
    return user?.uid || null;
  }

  async initializeStats(): Promise<UserStats> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const existingStats = await this.getStats();
      if (existingStats) {
        return existingStats;
      }

      const defaultStats: UserStats = {
        totalScans: 0,
        totalPoints: 0,
        scansThisWeek: 0,
        scansThisMonth: 0,
        lastScanDate: null,
        recyclingStreak: 0,
        wasteTypesScanned: {},
        accuracyScore: 0,
        recyclingPointSearches: 0,
        lastRecyclingSearch: null,
      };

      await firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current')
        .set(defaultStats);

      return defaultStats;
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation des stats Firebase:",
        error,
      );
      throw error;
    }
  }

  async addScan(
    wasteType: string,
    confidence: number,
  ): Promise<{
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

      let pointsEarned = this.POINTS_PER_SCAN;

      if (confidence > 0.8) {
        pointsEarned += this.BONUS_POINTS_HIGH_CONFIDENCE;
      }

      if (currentStats.recyclingStreak > 0) {
        pointsEarned += Math.min(
          currentStats.recyclingStreak * this.STREAK_BONUS,
          10,
        );
      }

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

      newStats.scansThisWeek = await this.calculateWeeklyScans();
      newStats.scansThisMonth = await this.calculateMonthlyScans();

      newStats.recyclingStreak = await this.calculateStreak(
        today,
        currentStats.lastScanDate,
      );

      newStats.accuracyScore = await this.calculateAccuracyScore();

      const batch = firestore().batch();

      const statsRef = firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current');

      batch.set(statsRef, newStats);

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

      await batch.commit();

      const message = this.generateMotivationalMessage(pointsEarned, newStats);

      return {
        pointsEarned,
        newStats,
        message,
      };
    } catch (error) {
      console.error("Erreur lors de l'ajout du scan Firebase:", error);
      throw error;
    }
  }

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

      if (statsDoc.exists()) {
        return statsDoc.data() as UserStats;
      }

      return null;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des stats Firebase:',
        error,
      );
      return null;
    }
  }

  private async calculateWeeklyScans(): Promise<number> {
    try {
      const history = await this.getScanHistory();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      return history.filter(scan => new Date(scan.timestamp) > oneWeekAgo)
        .length;
    } catch (error) {
      return 0;
    }
  }

  private async calculateMonthlyScans(): Promise<number> {
    try {
      const history = await this.getScanHistory();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      return history.filter(scan => new Date(scan.timestamp) > oneMonthAgo)
        .length;
    } catch (error) {
      return 0;
    }
  }

  private async calculateStreak(
    today: string,
    lastScanDate: string | null,
  ): Promise<number> {
    if (!lastScanDate) return 1;

    const lastScan = new Date(lastScanDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastScan.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const currentStats = await this.getStats();
      return (currentStats?.recyclingStreak || 0) + 1;
    } else if (diffDays === 0) {
      const currentStats = await this.getStats();
      return currentStats?.recyclingStreak || 0;
    } else {
      return 1;
    }
  }

  private async calculateAccuracyScore(): Promise<number> {
    try {
      const history = await this.getScanHistory();
      if (history.length === 0) return 0;

      const totalConfidence = history.reduce(
        (sum, scan) => sum + scan.confidence,
        0,
      );
      return Math.round((totalConfidence / history.length) * 100);
    } catch (error) {
      return 0;
    }
  }

  // Récupération de l'historique des scans
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
        .limit(100)
        .get();

      return historySnapshot.docs.map(doc => doc.data() as ScanResult);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'historique Firebase:",
        error,
      );
      return [];
    }
  }

  private generateMotivationalMessage(
    pointsEarned: number,
    stats: UserStats,
  ): string {
    const messages = [
      `🎉 +${pointsEarned} points ! Excellent recyclage !`,
      `♻️ Bravo ! Vous avez maintenant ${stats.totalPoints} points !`,
      `🔥 Streak de ${stats.recyclingStreak} jours ! Continuez !`,
      `📊 ${stats.totalScans} déchets recyclés ! Vous êtes un champion !`,
      `🌟 Score de précision : ${stats.accuracyScore}% ! Impressionnant !`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  async getLeaderboard(): Promise<{
    totalPoints: number;
    totalScans: number;
    recyclingStreak: number;
    accuracyScore: number;
    rank?: number;
  }> {
    const stats = await this.getStats();
    if (!stats) {
      return {
        totalPoints: 0,
        totalScans: 0,
        recyclingStreak: 0,
        accuracyScore: 0,
      };
    }

    const rank = await this.calculateUserRank(stats.totalPoints);

    return {
      totalPoints: stats.totalPoints,
      totalScans: stats.totalScans,
      recyclingStreak: stats.recyclingStreak,
      accuracyScore: stats.accuracyScore,
      rank,
    };
  }

  private async calculateUserRank(
    userPoints: number,
  ): Promise<number | undefined> {
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

  async resetStats(): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const batch = firestore().batch();

      const statsRef = firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_STATS)
        .doc('current');

      batch.delete(statsRef);

      const historySnapshot = await firestore()
        .collection(this.COLLECTION_USERS)
        .doc(userId)
        .collection(this.COLLECTION_SCAN_HISTORY)
        .get();

      historySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      await this.initializeStats();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation Firebase:', error);
    }
  }

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
      .onSnapshot(doc => {
        if (doc.exists()) {
          callback(doc.data() as UserStats);
        } else {
          callback(null);
        }
      });
  }
}

export default new FirebaseStatsService();
