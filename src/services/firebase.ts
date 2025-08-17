import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Les configurations sont automatiquement chargées depuis google-services.json
// sur Android et GoogleService-Info.plist sur iOS.
// Pas besoin d'initialisation manuelle avec React Native Firebase

export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();

// Pas d'export par défaut car pas d'initialisation manuelle
