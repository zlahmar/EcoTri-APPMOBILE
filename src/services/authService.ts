import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

class AuthService {
  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  }

  // Récupération de l'utilisateur actuel
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  // Connexion avec email et mot de passe
  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserData> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      await this.updateLastLogin(user.uid);

      const userData = await this.getUserData(user.uid);

      return userData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async createUserWithEmailAndPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<UserData> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      const userData: Omit<UserData, 'uid'> = {
        email,
        firstName,
        lastName,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      await firestore().collection('users').doc(user.uid).set(userData);

      return {
        uid: user.uid,
        ...userData,
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      // Vérifier si l'utilisateur est connecté avant de se déconnecter
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('Aucun utilisateur connecté, déconnexion ignorée');
        return;
      }

      await auth().signOut();
      console.log('Déconnexion réussie');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion Firebase:', error);

      // Si l'erreur est "no-current-user", c'est normal après déconnexion
      if (error.code === 'auth/no-current-user') {
        console.log('Utilisateur déjà déconnecté');
        return;
      }

      throw this.handleAuthError(error);
    }
  }

  async getUserData(uid: string): Promise<UserData> {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new Error('Profil utilisateur non trouvé');
      }

      const data = userDoc.data();
      return {
        uid,
        email: data?.email || '',
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        createdAt: data?.createdAt?.toDate() || new Date(),
        lastLoginAt: data?.lastLoginAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      throw new Error(
        'Erreur lors de la récupération du profil: ' + error.message,
      );
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await firestore().collection('users').doc(uid).update({
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.warn(
        'Erreur lors de la mise à jour de la dernière connexion:',
        error,
      );
    }
  }

  private handleAuthError(error: any): AuthError {
    let userFriendlyMessage = 'Une erreur est survenue';

    switch (error.code) {
      case 'auth/user-not-found':
        userFriendlyMessage = 'Aucun compte trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        userFriendlyMessage = 'Mot de passe incorrect';
        break;
      case 'auth/invalid-email':
        userFriendlyMessage = "Format d'email invalide";
        break;
      case 'auth/weak-password':
        userFriendlyMessage =
          'Le mot de passe doit contenir au moins 6 caractères';
        break;
      case 'auth/email-already-in-use':
        userFriendlyMessage = 'Cet email est déjà utilisé par un autre compte';
        break;
      case 'auth/too-many-requests':
        userFriendlyMessage = 'Trop de tentatives. Réessayez plus tard';
        break;
      case 'auth/network-request-failed':
        userFriendlyMessage = 'Erreur de connexion réseau';
        break;
      case 'auth/no-current-user':
        userFriendlyMessage = 'Aucun utilisateur connecté';
        break;
      default:
        userFriendlyMessage =
          error.message || 'Une erreur inattendue est survenue';
    }

    return {
      code: error.code || 'unknown',
      message: error.message || 'Unknown error',
      userFriendlyMessage,
    };
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  isEmailVerified(): boolean {
    const user = auth().currentUser;
    return user ? user.emailVerified : false;
  }

  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
}

export default new AuthService();
