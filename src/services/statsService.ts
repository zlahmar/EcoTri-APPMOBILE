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
  recyclingPointSearches: number; // Nombre de recherches de points de recyclage
  lastRecyclingSearch: string | null; // Date de la dernière recherche
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

  // Points par scan réussi
  private readonly POINTS_PER_SCAN = 10;
  private readonly BONUS_POINTS_HIGH_CONFIDENCE = 5;
  private readonly STREAK_BONUS = 2;

  // Initialisation des statistiques
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
        recyclingPointSearches: 0,
        lastRecyclingSearch: null,
      };

      await this.saveStats(defaultStats);
      return defaultStats;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des stats:', error);
      throw error;
    }
  }

  // Ajout d'un scan et calcul des points
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

      let pointsEarned = this.POINTS_PER_SCAN;
    
      if (confidence > 0.8) {
        pointsEarned += this.BONUS_POINTS_HIGH_CONFIDENCE;
      }

      if (currentStats.recyclingStreak > 0) {
        pointsEarned += Math.min(currentStats.recyclingStreak * this.STREAK_BONUS, 10);
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

      newStats.recyclingStreak = await this.calculateStreak(currentStats.lastScanDate, today);

      newStats.accuracyScore = await this.calculateAccuracyScore();

      await this.saveStats(newStats);

      return {
        pointsEarned,
        newStats,
        message: `+${pointsEarned} points ! ${this.getStreakMessage(newStats.recyclingStreak)}`,
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du scan:', error);
      throw error;
    }
  }

  // Enregistrement d'une recherche de points de recyclage
  async addRecyclingPointSearch(): Promise<{
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

      const newStats: UserStats = {
        ...currentStats,
        recyclingPointSearches: currentStats.recyclingPointSearches + 1,
        lastRecyclingSearch: today,
      };

      await this.saveStats(newStats);

      return {
        newStats,
        message: `Recherche de points de recyclage enregistrée ! Total: ${newStats.recyclingPointSearches}`,
      };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la recherche:', error);
      throw error;
    }
  }

  // Récupération des statistiques actuelles
  async getStats(): Promise<UserStats | null> {
    try {
      const statsData = await AsyncStorage.getItem(this.STORAGE_KEY);
      return statsData ? JSON.parse(statsData) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  }

  // Calcul des scans de la semaine
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

  // Calcul des scans du mois
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

  // Calcul du streak de recyclage
  private async calculateStreak(today: string, lastScanDate: string | null): Promise<number> {
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

  // Calcul du score de précision moyen
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

  // Sauvegarde des statistiques
  private async saveStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des stats:', error);
      throw error;
    }
  }

  // Ajout à l'historique des scans
  private async addToScanHistory(scan: ScanResult): Promise<void> {
    try {
      const history = await this.getScanHistory();
      history.push(scan);
      
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }

      await AsyncStorage.setItem(this.SCAN_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'historique:', error);
    }
  }

  // Récupération de l'historique des scans
  async getScanHistory(): Promise<ScanResult[]> {
    try {
      const historyData = await AsyncStorage.getItem(this.SCAN_HISTORY_KEY);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      return [];
    }
  }

  // Génération d'un message de motivation
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

  // Récupération des classements
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

  // Réinitialisation des statistiques
  async resetStats(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      await AsyncStorage.removeItem(this.SCAN_HISTORY_KEY);
      await this.initializeStats();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }

  private getStreakMessage(streak: number): string {
    if (streak === 0) return '';
    if (streak === 1) return 'Votre streak de recyclage est de 1 jour !';
    return `Votre streak de recyclage est de ${streak} jours !`;
  }
}

export default new StatsService();
