import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  // Les configurations sont automatiquement chargées depuis google-services.json
  // sur Android et GoogleService-Info.plist sur iOS.
};

const app = initializeApp(firebaseConfig);

export const firebaseApp = app;
export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();

export default app;
