import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Configuration Firebase (optionnelle car auto-configurée via google-services.json)
const firebaseConfig = {
  // Les configurations sont automatiquement chargées depuis google-services.json
  // sur Android et GoogleService-Info.plist sur iOS
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des services Firebase
export const firebaseApp = app;
export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();

export default app;
