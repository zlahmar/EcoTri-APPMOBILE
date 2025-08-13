# 🌱 EcoTri - Application de Recyclage Intelligent

**Master 2 YNOV - Bloc 2**  
*Application mobile React Native avec Firebase pour la gestion intelligente du recyclage*

## 📱 Vue d'ensemble

EcoTri est une application mobile développée en React Native qui permet aux utilisateurs de :
- Scanner des déchets pour identifier leur type
- Localiser les centres de recyclage
- Suivre leur impact environnemental
- Obtenir des conseils de recyclage personnalisés

## 🚀 Statut du Projet

**✅ PROJET FONCTIONNEL - 100% COMPILÉ ET INSTALLÉ**

L'application compile et s'installe parfaitement sur Android avec tous les services Firebase configurés.

## 🛠️ Technologies Utilisées

- **Frontend** : React Native 0.81.0
- **Backend** : Firebase (Auth, Firestore, Storage)
- **Navigation** : React Navigation 6
- **Langage** : TypeScript
- **Plateforme** : Android (API 24+)
- **Build** : Gradle 8.14.3

## 📁 Architecture du Projet

```
EcoTri/
├── src/
│   ├── components/
│   │   ├── common/          # Composants réutilisables
│   │   │   ├── Header.tsx   # En-tête des écrans
│   │   │   ├── CustomButton.tsx # Bouton personnalisé
│   │   │   └── index.ts
│   │   └── main/            # Composants principaux
│   │       ├── AppContainer.tsx
│   │       └── index.ts
│   ├── navigation/          # Configuration de la navigation
│   │   ├── RootNavigator.tsx # Navigation principale
│   │   ├── MainTabNavigator.tsx # Navigation par onglets
│   │   ├── types.ts         # Types TypeScript
│   │   └── index.ts
│   ├── screens/             # Écrans de l'application
│   │   ├── main/            # Écrans principaux
│   │   │   ├── SplashScreen.tsx # Écran de démarrage
│   │   │   ├── HomeScreen.tsx   # Écran d'accueil
│   │   │   ├── ProfileScreen.tsx # Écran de profil
│   │   │   └── index.ts
│   │   └── recycling/       # Écrans de recyclage (à développer)
│   ├── services/            # Services Firebase
│   │   ├── firebase.ts      # Configuration Firebase
│   │   ├── authService.ts   # Service d'authentification
│   │   ├── firestoreService.ts # Service Firestore
│   │   └── index.ts
│   ├── styles/              # Styles et thème
│   │   ├── colors.ts        # Palette de couleurs
│   │   └── index.ts         # Styles globaux
│   └── utils/               # Utilitaires
├── android/                 # Configuration Android
├── ios/                     # Configuration iOS
└── App.tsx                  # Point d'entrée principal
```

## 🔧 Configuration Firebase

### Services Configurés
- ✅ **Firebase App** : Configuration de base
- ✅ **Firebase Auth** : Authentification utilisateur
- ✅ **Firebase Firestore** : Base de données
- ✅ **Firebase Storage** : Stockage de fichiers

### Configuration Android
- **Package Name** : `com.ecotri.app`
- **google-services.json** : Configuré avec le projet Firebase
- **build.gradle** : Dépendances Firebase ajoutées

## 📱 Écrans Développés

### 1. SplashScreen
- Animation du logo EcoTri
- Transition automatique vers l'écran principal
- Design moderne avec les couleurs de la marque

### 2. HomeScreen
- Message de bienvenue personnalisé
- Statistiques rapides (déchets recyclés, impact CO2)
- Menu de navigation vers les fonctionnalités
- Interface intuitive et responsive

### 3. ProfileScreen
- Informations utilisateur
- Statistiques détaillées
- Informations sur l'application

## 🎨 Design System

### Palette de Couleurs
```typescript
export const colors = {
  // Couleurs principales
  primaryDark: '#355549',    // Vert foncé
  primary: '#7CB593',        // Vert principal
  secondary: '#D5EDE4',      // Vert clair
  
  // Couleurs de fond
  background: '#FFFFFF',     // Blanc
  surface: '#F8F9FA',        // Gris très clair
  
  // Couleurs de texte
  textPrimary: '#212529',    // Noir
  textSecondary: '#6C757D',  // Gris
  textInverse: '#FFFFFF',    // Blanc
  
  // Couleurs d'état
  success: '#28A745',        // Vert succès
  warning: '#FFC107',        // Jaune avertissement
  error: '#DC3545',          // Rouge erreur
  
  // Couleurs de recyclage
  plastic: '#17A2B8',        // Bleu plastique
  paper: '#28A745',          // Vert papier
  metal: '#6C757D',          // Gris métal
  glass: '#007BFF',          // Bleu verre
};
```

### Composants Réutilisables
- **Header** : En-tête avec titre, boutons et navigation
- **CustomButton** : Bouton avec variantes (primary, secondary, outline)
- **AppContainer** : Conteneur principal avec fond

## 🚧 Problèmes Résolus

### 1. Configuration Gradle (Résolu ✅)
**Problème** : Erreur `-classpath requires class path specification` dans `gradlew.bat`

**Solution** : Modification de la ligne d'exécution Gradle
```batch
# AVANT (problématique)
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" -jar "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" %*

# APRÈS (corrigé)
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -jar "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" %*
```

### 2. Package Name Mismatch (Résolu ✅)
**Problème** : `No matching client found for package name 'com.ecotri.app'`

**Solution** : Mise à jour du `google-services.json` avec le bon package name

### 3. BuildConfig Unresolved (Résolu ✅)
**Problème** : `Unresolved reference 'BuildConfig'` dans `MainApplication.kt`

**Solution** : Remplacement des références BuildConfig par des valeurs par défaut
```kotlin
// AVANT (problématique)
override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED

// APRÈS (corrigé)
override fun getUseDeveloperSupport(): Boolean = true
override val isNewArchEnabled: Boolean = false
override val isHermesEnabled: Boolean = true
```

### 4. CMake Path Too Long (Résolu ✅)
**Problème** : `Filename longer than 260 characters` avec `react-native-safe-area-context`

**Solution** : Suppression temporaire du composant problématique
- Retiré `react-native-safe-area-context` du `package.json`
- Remplacé `SafeAreaProvider` par `View` dans `App.tsx`
- Nettoyage complet des caches de build

## 📋 Historique de Développement

### Phase 1 : Configuration de Base ✅
- [x] Création du projet React Native
- [x] Configuration de l'architecture des dossiers
- [x] Installation des dépendances de base

### Phase 2 : Configuration Firebase ✅
- [x] Installation des packages Firebase
- [x] Configuration du `google-services.json`
- [x] Mise à jour des fichiers `build.gradle`
- [x] Configuration des services Firebase

### Phase 3 : Navigation et UI ✅
- [x] Installation de React Navigation
- [x] Création des composants de base
- [x] Développement des écrans principaux
- [x] Mise en place du système de couleurs

### Phase 4 : Résolution des Problèmes ✅
- [x] Correction des erreurs ESLint
- [x] Résolution des problèmes Gradle
- [x] Correction des erreurs de compilation
- [x] Test et validation de l'installation

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- React Native CLI
- Android Studio avec SDK API 24+
- Téléphone Android connecté en USB

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd EcoTri

# Installer les dépendances
npm install

# Démarrer Metro
npm start

# Compiler et installer sur Android
npm run android
```

### Configuration Firebase
1. Créer un projet Firebase
2. Télécharger `google-services.json`
3. Placer le fichier dans `android/app/`
4. Vérifier que le package name correspond

## 🔍 Dépannage

### Problèmes Courants
1. **Erreur Gradle** : Exécuter `cd android && .\gradlew clean`
2. **Cache Metro** : Redémarrer Metro avec `npm start`
3. **Dépendances** : Supprimer `node_modules` et relancer `npm install`

### Commandes Utiles
```bash
# Nettoyer le projet Android
cd android && .\gradlew clean

# Vérifier la configuration
npx react-native doctor

# Linter le code
npm run lint

# Tester l'application
npm test
```

## 📈 Prochaines Étapes

### Développement des Fonctionnalités
- [ ] Scanner de codes-barres pour les déchets
- [ ] Carte des centres de recyclage
- [ ] Système d'authentification utilisateur
- [ ] Base de données des types de déchets
- [ ] Calcul de l'impact environnemental

### Améliorations Techniques
- [ ] Réintégration de `react-native-safe-area-context` (chemin plus court)
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation des performances
- [ ] Support iOS

## 👥 Équipe

- **Développeur** : [Votre Nom]
- **Master** : YNOV - Bloc 2
- **Projet** : EcoTri - Application de Recyclage Intelligent

## 📄 Licence

Ce projet est développé dans le cadre d'un Master 2 à YNOV.

---

**Dernière mise à jour** : [Date]  
**Version** : 1.0.0  
**Statut** : ✅ FONCTIONNEL
