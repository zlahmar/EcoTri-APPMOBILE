import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserStats {
  totalScans: number;
  totalPoints: number;
  scansThisWeek: number;
  scansThisMonth: number;
  lastScanDate: string | null;
  recyclingStreak: number; // Nombre de jours consécutifs
  wasteTypesScanned: {
    [key: string]: number; // Type de déchet -> nombre de scans
  };
  accuracyScore: number; // Score de précision moyen
}

export interface ScanResult {
  timestamp: string;
  points: number;
  wasteType: string;
  confidence: number;
}

class StatsService {
  private readonly STORAGE_KEY = 'ecotri_user_stats';
  private readonly SCAN_HISTORY_KEY = 'ecotri_scan_history';

  // 🎯 Points par scan réussi
  private readonly POINTS_PER_SCAN = 10;
  private readonly BONUS_POINTS_HIGH_CONFIDENCE = 5; // Bonus si confiance > 80%
  private readonly STREAK_BONUS = 2; // Bonus par jour consécutif

  // 📊 Initialiser les statistiques
  async initializeStats(): Promise<UserStats> {
    try {
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
      };

      await this.saveStats(defaultStats);
      return defaultStats;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des stats:', error);
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

      // 💾 Sauvegarder
      await this.saveStats(newStats);
      await this.addToScanHistory({
        timestamp: now.toISOString(),
        points: pointsEarned,
        wasteType,
        confidence,
      });

      // 🎉 Message de motivation
      const message = this.generateMotivationalMessage(pointsEarned, newStats);

      return {
        pointsEarned,
        newStats,
        message,
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du scan:', error);
      throw error;
    }
  }

  // 📊 Obtenir les statistiques actuelles
  async getStats(): Promise<UserStats | null> {
    try {
      const statsData = await AsyncStorage.getItem(this.STORAGE_KEY);
      return statsData ? JSON.parse(statsData) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
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

  // 💾 Sauvegarder les statistiques
  private async saveStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des stats:', error);
      throw error;
    }
  }

  // 📝 Ajouter au historique des scans
  private async addToScanHistory(scan: ScanResult): Promise<void> {
    try {
      const history = await this.getScanHistory();
      history.push(scan);
      
      // Garder seulement les 100 derniers scans
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }

      await AsyncStorage.setItem(this.SCAN_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'historique:', error);
    }
  }

  // 📚 Obtenir l'historique des scans
  async getScanHistory(): Promise<ScanResult[]> {
    try {
      const historyData = await AsyncStorage.getItem(this.SCAN_HISTORY_KEY);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
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

  // 🏆 Obtenir les classements
  async getLeaderboard(): Promise<{
    totalPoints: number;
    totalScans: number;
    recyclingStreak: number;
    accuracyScore: number;
  }> {
    const stats = await this.getStats();
    if (!stats) return { totalPoints: 0, totalScans: 0, recyclingStreak: 0, accuracyScore: 0 };

    return {
      totalPoints: stats.totalPoints,
      totalScans: stats.totalScans,
      recyclingStreak: stats.recyclingStreak,
      accuracyScore: stats.accuracyScore,
    };
  }

  // 🔄 Réinitialiser les statistiques (pour les tests)
  async resetStats(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      await AsyncStorage.removeItem(this.SCAN_HISTORY_KEY);
      await this.initializeStats();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }
}

export default new StatsService();
