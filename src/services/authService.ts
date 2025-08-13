import { firebaseAuth, firebaseFirestore } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  level: number;
  points: number;
  totalWasteScanned: number;
  recyclingRate: number;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

class AuthService {
  // Inscription d'un nouvel utilisateur
  async signUp(email: string, password: string, displayName?: string): Promise<UserProfile> {
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (user) {
        // Mise à jour du nom d'affichage
        if (displayName) {
          await user.updateProfile({ displayName });
        }
        
        // Création du profil utilisateur dans Firestore
        const userProfile: Omit<UserProfile, 'uid'> = {
          email: user.email || email,
          displayName: displayName || '',
          level: 1,
          points: 0,
          totalWasteScanned: 0,
          recyclingRate: 0,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };
        
        await firebaseFirestore
          .collection('users')
          .doc(user.uid)
          .set(userProfile);
        
        return {
          uid: user.uid,
          ...userProfile,
        };
      }
      
      throw new Error('Erreur lors de la création du compte');
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Connexion d'un utilisateur
  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (user) {
        // Mise à jour de la dernière connexion
        await firebaseFirestore
          .collection('users')
          .doc(user.uid)
          .update({ lastLoginAt: new Date() });
        
        // Récupération du profil utilisateur
        const userDoc = await firebaseFirestore
          .collection('users')
          .doc(user.uid)
          .get();
        
        if (userDoc.exists) {
          return {
            uid: user.uid,
            ...userDoc.data(),
          } as UserProfile;
        }
        
        throw new Error('Profil utilisateur non trouvé');
      }
      
      throw new Error('Erreur lors de la connexion');
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Déconnexion
  async signOut(): Promise<void> {
    try {
      await firebaseAuth.signOut();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Réinitialisation du mot de passe
  async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Mise à jour du profil utilisateur
  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await firebaseFirestore
        .collection('users')
        .doc(uid)
        .update(updates);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Récupération du profil utilisateur actuel
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) return null;
      
      const userDoc = await firebaseFirestore
        .collection('users')
        .doc(user.uid)
        .get();
      
      if (userDoc.exists) {
        return {
          uid: user.uid,
          ...userDoc.data(),
        } as UserProfile;
      }
      
      return null;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Écouteur de l'état d'authentification
  onAuthStateChanged(callback: (user: any) => void) {
    return firebaseAuth.onAuthStateChanged(callback);
  }

  // Gestion des erreurs d'authentification
  private handleAuthError(error: any): AuthError {
    let message = 'Une erreur est survenue';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Aucun utilisateur trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/email-already-in-use':
        message = 'Cet email est déjà utilisé';
        break;
      case 'auth/weak-password':
        message = 'Le mot de passe est trop faible';
        break;
      case 'auth/invalid-email':
        message = 'Email invalide';
        break;
      case 'auth/too-many-requests':
        message = 'Trop de tentatives. Réessayez plus tard';
        break;
      default:
        message = error.message || message;
    }
    
    return {
      code: error.code || 'unknown',
      message,
    };
  }
}

export default new AuthService();
