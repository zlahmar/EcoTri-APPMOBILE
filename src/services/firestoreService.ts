import { firebaseFirestore } from './firebase';

export interface WasteItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  recyclingInstructions: string;
  imageUrl?: string;
  scannedAt: Date;
  isRecyclable: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RecyclingCenter {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  acceptedMaterials: string[];
  openingHours: string;
  phone?: string;
  website?: string;
  rating: number;
  distance?: number;
}

export interface RecyclingTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  likes: number;
}

export interface CollectionSchedule {
  id: string;
  userId: string;
  wasteType: string;
  collectionDate: Date;
  reminderTime: Date;
  isCompleted: boolean;
  notes?: string;
}

class FirestoreService {
  // GESTION DES DÉCHETS
  
  async addWasteItem(wasteItem: Omit<WasteItem, 'id'>): Promise<string> {
    try {
      const docRef = await firebaseFirestore
        .collection('wasteItems')
        .add(wasteItem);
      
      return docRef.id;
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout du déchet: ${error}`);
    }
  }

  async getUserWasteHistory(userId: string, limit = 20): Promise<WasteItem[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('wasteItems')
        .where('userId', '==', userId)
        .orderBy('scannedAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WasteItem[];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'historique: ${error}`);
    }
  }

  // GESTION DES CENTRES DE RECYCLAGE
  
  async getRecyclingCenters(): Promise<RecyclingCenter[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('recyclingCenters')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RecyclingCenter[];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des centres: ${error}`);
    }
  }

  async getCentersByMaterial(material: string): Promise<RecyclingCenter[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('recyclingCenters')
        .where('acceptedMaterials', 'array-contains', material)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RecyclingCenter[];
    } catch (error) {
      throw new Error(`Erreur lors de la recherche des centres: ${error}`);
    }
  }

  // GESTION DES CONSEILS
  
  async getRecyclingTips(category?: string): Promise<RecyclingTip[]> {
    try {
      let query = firebaseFirestore.collection('recyclingTips');
      
      if (category) {
        query = query.where('category', '==', category);
      }
      
      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RecyclingTip[];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des conseils: ${error}`);
    }
  }

  async getDailyTip(): Promise<RecyclingTip | null> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const snapshot = await firebaseFirestore
        .collection('recyclingTips')
        .where('createdAt', '>=', startOfDay)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as RecyclingTip;
      }
      
      const allTips = await this.getRecyclingTips();
      if (allTips.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTips.length);
        return allTips[randomIndex];
      }
      
      return null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du conseil du jour: ${error}`);
    }
  }

  // GESTION DES PLANNINGS DE COLLECTE
  
  async addCollectionSchedule(schedule: Omit<CollectionSchedule, 'id'>): Promise<string> {
    try {
      const docRef = await firebaseFirestore
        .collection('collectionSchedules')
        .add(schedule);
      
      return docRef.id;
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout du planning: ${error}`);
    }
  }

  async getUserCollectionSchedules(userId: string): Promise<CollectionSchedule[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('collectionSchedules')
        .where('userId', '==', userId)
        .orderBy('collectionDate', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as CollectionSchedule[];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des plannings: ${error}`);
    }
  }

  async markCollectionCompleted(scheduleId: string): Promise<void> {
    try {
      await firebaseFirestore
        .collection('collectionSchedules')
        .doc(scheduleId)
        .update({ isCompleted: true });
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du planning: ${error}`);
    }
  }

  // STATISTIQUES
  
  async getUserRecyclingStats(userId: string) {
    try {
      const wasteSnapshot = await firebaseFirestore
        .collection('wasteItems')
        .where('userId', '==', userId)
        .get();
      
      const totalWaste = wasteSnapshot.size;
      const recyclableWaste = wasteSnapshot.docs.filter(
        doc => doc.data().isRecyclable
      ).length;
      
      const recyclingRate = totalWaste > 0 ? (recyclableWaste / totalWaste) * 100 : 0;
      
      return {
        totalWasteScanned: totalWaste,
        recyclableWaste,
        recyclingRate: Math.round(recyclingRate * 100) / 100,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error}`);
    }
  }
}

export default new FirestoreService();
