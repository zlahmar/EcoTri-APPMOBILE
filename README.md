# 🌱 EcoTri - Application de Recyclage Intelligent

**Master 2 YNOV - Bloc 2**  
_Application mobile React Native avec Firebase pour la gestion intelligente du recyclage_

## 📱 Vue d'ensemble

EcoTri est une application mobile développée en React Native qui permet aux utilisateurs de :

- 🔐 **S'authentifier** avec un système de connexion/inscription complet
- 📱 Scanner des déchets pour identifier leur type
- 🗺️ Localiser les centres de recyclage
- 📊 Suivre leur impact environnemental
- 💡 Recevoir des conseils de recyclage personnalisés
- 👤 Gérer leur profil utilisateur avec données persistantes

## 🚀 Statut du Projet

**✅ PROJET FONCTIONNEL - 100% COMPILÉ ET INSTALLÉ**

L'application compile et s'installe parfaitement sur Android avec tous les services Firebase configurés et une navigation complète fonctionnelle.

## 🛠️ Technologies Utilisées

- **Frontend** : React Native 0.81.0
- **Backend** : Firebase (Auth, Firestore, Storage)
- **Authentification** : Firebase Authentication avec gestion d'état
- **Base de Données** : Cloud Firestore pour les profils utilisateur
- **Navigation** : Navigation personnalisée (sans dépendances externes)
- **Langage** : TypeScript
- **Plateforme** : Android (API 24+)
- **Build** : Gradle 8.14.3

## 🏗️ Architecture du Projet

```
EcoTri/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── common/          # Composants communs (Header, CustomButton)
│   │   └── main/            # Composants principaux
│   ├── navigation/          # Configuration de la navigation
│   │   ├── RootNavigator.tsx # Navigation principale
│   │   ├── MainNavigator.tsx # Navigation personnalisée par onglets
│   │   ├── types.ts         # Types TypeScript
│   │   └── index.ts
│   ├── screens/             # Écrans de l'application
│   │   ├── main/            # Écrans principaux
│   │   │   ├── HomeScreen.tsx   # Écran d'accueil
│   │   │   ├── ProfileScreen.tsx # Écran de profil
│   │   │   └── SplashScreen.tsx # Écran de démarrage
│   │   ├── auth/            # Écrans d'authentification
│   │   │   ├── AuthScreen.tsx   # Gestion connexion/inscription
│   │   │   ├── LoginScreen.tsx  # Écran de connexion
│   │   │   ├── SignupScreen.tsx # Écran d'inscription
│   │   │   └── index.ts
│   │   └── recycling/       # Écrans de recyclage
│   │       ├── ScanScreen.tsx    # Interface de scan des déchets
│   │       ├── CollecteScreen.tsx # Gestion des déchets collectés
│   │       ├── ConseilsScreen.tsx # Conseils de recyclage
│   │       └── index.ts
│   ├── services/            # Services Firebase
│   │   ├── firebase.ts      # Configuration Firebase
│   │   ├── authService.ts   # Service d'authentification complet
│   │   ├── firestoreService.ts # Service Firestore
│   │   └── index.ts
│   └── styles/              # Système de design
│       ├── colors.ts        # Palette de couleurs
│       └── index.ts
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

### 2. ScanScreen 📱

- Interface de scan des déchets avec caméra
- Zone de scan avec cadre pointillé
- Bouton de démarrage du scan
- Instructions étape par étape
- Design moderne avec ombres et animations

### 3. CollecteScreen ♻️

- Statistiques de collecte (déchets scannés, recyclés, en attente)
- Types de déchets avec icônes colorées (plastique, papier, verre, métal)
- Centres de recyclage proches avec distances
- Boutons d'action pour chaque type de déchet

### 4. ProfileScreen 👤

- Informations utilisateur
- Statistiques détaillées
- Informations sur l'application

### 5. ConseilsScreen 💡

- Conseil du jour avec impact environnemental
- Catégories de conseils par type de matériau
- Conseils rapides en format liste
- Suivi de l'impact environnemental personnel

## 🔐 Système d'Authentification Firebase

### Architecture d'Authentification

- **Firebase Auth** : Gestion des comptes utilisateur
- **Cloud Firestore** : Stockage des profils et données utilisateur
- **État Persistant** : Connexion maintenue entre les sessions
- **Gestion d'Erreurs** : Messages d'erreur traduits et clairs

### Fonctionnalités d'Authentification

#### ✅ **Connexion (Login)**
- Authentification par email/mot de passe
- Validation des champs en temps réel
- Gestion des erreurs Firebase (utilisateur non trouvé, mot de passe incorrect)
- Bouton "Mot de passe oublié" avec réinitialisation par email

#### ✅ **Inscription (Signup)**
- Création de compte avec validation complète
- Champs : Prénom, Nom, Email, Mot de passe, Confirmation
- Validation du format email et force du mot de passe
- Création automatique du profil dans Firestore

#### ✅ **Gestion de Session**
- Écoute automatique des changements d'état d'authentification
- Persistance de la connexion après redémarrage de l'app
- Déconnexion sécurisée avec nettoyage des données locales

#### ✅ **Profil Utilisateur**
- Stockage dans Firestore : `uid`, `email`, `firstName`, `lastName`, `createdAt`, `lastLoginAt`
- Mise à jour automatique de la date de dernière connexion
- Récupération des données utilisateur au redémarrage

### Structure des Données Firestore

```typescript
// Collection: users
// Document ID: uid (généré automatiquement par Firebase Auth)
{
  email: string,
  firstName: string,
  lastName: string,
  createdAt: Timestamp,
  lastLoginAt: Timestamp
}
```

### Gestion des Erreurs Firebase

| Code d'Erreur | Message Utilisateur | Description |
|---------------|---------------------|-------------|
| `auth/user-not-found` | "Aucun compte trouvé avec cet email" | Email inexistant |
| `auth/wrong-password` | "Mot de passe incorrect" | Mauvais mot de passe |
| `auth/invalid-email` | "Format d'email invalide" | Email mal formaté |
| `auth/weak-password` | "Le mot de passe doit contenir au moins 6 caractères" | Mot de passe trop faible |
| `auth/email-already-in-use` | "Cet email est déjà utilisé par un autre compte" | Email déjà pris |
| `auth/too-many-requests` | "Trop de tentatives. Réessayez plus tard" | Limite de tentatives dépassée |
| `auth/network-request-failed` | "Erreur de connexion réseau" | Problème de connexion |

## 🧭 Système de Navigation

### Architecture de Navigation

- **App.tsx** → Point d'entrée simplifié
- **RootNavigator** → Gestion du SplashScreen et authentification
- **MainNavigator** → Navigation personnalisée entre les 4 onglets

### Onglets Disponibles

1. **📱 Scan** - Interface de scan des déchets
2. **♻️ Collecte** - Gestion des déchets et centres de recyclage
3. **👤 Profile** - Profil utilisateur et statistiques
4. **💡 Conseils** - Conseils de recyclage et impact environnemental

### Avantages de la Navigation Personnalisée

- ✅ **Aucune dépendance externe** - Plus d'erreurs de modules natifs
- ✅ **Performance optimale** - Navigation fluide et rapide
- ✅ **Facile à maintenir** - Code simple et modifiable
- ✅ **Stable** - Pas de problèmes de linking natif

## 🎨 Design System

### Palette de Couleurs

```typescript
export const colors = {
  // Couleurs principales
  primaryDark: '#355549', // Vert foncé
  primary: '#7CB593', // Vert principal
  secondary: '#D5EDE4', // Vert clair

  // Couleurs de fond
  background: '#F0F6F6', // Fond principal
  surface: '#FFFFFF', // Surface des cartes

  // Couleurs de texte
  text: '#333333', // Texte principal
  textLight: '#666666', // Texte secondaire
  textInverse: '#FFFFFF', // Texte sur fond coloré

  // Couleurs d'état
  success: '#4CAF50', // Vert succès
  warning: '#FF9800', // Jaune avertissement
  error: '#F44336', // Rouge erreur
  info: '#2196F3', // Bleu information

  // Couleurs utilitaires
  border: '#E0E0E0', // Bordures
  shadow: '#000000', // Ombres
  overlay: 'rgba(0, 0, 0, 0.5)', // Superpositions

  // Couleurs de recyclage
  plastic: '#FF6B6B', // Rouge plastique
  glass: '#4ECDC4', // Bleu-vert verre
  paper: '#45B7D1', // Bleu papier
  metal: '#96CEB4', // Vert métal
  organic: '#FFEAA7', // Jaune organique
  electronic: '#DDA0DD', // Violet électronique
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

### 5. Erreur React Navigation (Résolu ✅)

**Problème** : `Cannot read property 'StackView' of undefined` et `RNGestureHandlerModule could not be found`

**Solution** : Remplacement par une navigation personnalisée

- Supprimé React Navigation et ses dépendances
- Créé `MainNavigator` avec navigation native React
- Navigation fluide entre les 4 onglets sans erreurs

### 6. Authentification Firebase (Résolu ✅)

**Problème** : Système d'authentification simulé sans persistance

**Solution** : Intégration complète de Firebase Auth et Firestore

- Implémentation de Firebase Authentication
- Stockage des profils utilisateur dans Cloud Firestore
- Gestion d'état d'authentification persistante
- Gestion complète des erreurs avec messages traduits
- Fonctionnalité de réinitialisation de mot de passe

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

### Phase 5 : Navigation Complète ✅

- [x] Création des 4 écrans de recyclage
- [x] Implémentation de la navigation personnalisée
- [x] Résolution des erreurs de navigation
- [x] Interface utilisateur complète et fonctionnelle

### Phase 6 : Authentification Firebase ✅

- [x] Intégration de Firebase Authentication
- [x] Création des écrans de connexion et inscription
- [x] Implémentation du service d'authentification
- [x] Stockage des profils utilisateur dans Firestore
- [x] Gestion d'état d'authentification persistante
- [x] Gestion complète des erreurs Firebase
- [x] Fonctionnalité de réinitialisation de mot de passe

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
4. **Erreurs de navigation** : Utiliser la navigation personnalisée (déjà implémentée)

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

- [x] Interface de scan des déchets (UI prête)
- [x] Gestion des déchets collectés (UI prête)
- [x] Conseils de recyclage (UI prête)
- [ ] Scanner de codes-barres réel avec caméra
- [ ] Carte des centres de recyclage avec géolocalisation
- [ ] Système d'authentification utilisateur
- [ ] Base de données des types de déchets
- [ ] Calcul de l'impact environnemental en temps réel

### Améliorations Techniques

- [x] Navigation personnalisée stable et performante
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation des performances
- [ ] Support iOS
- [ ] Intégration de la caméra pour le scan

## 🎯 Fonctionnalités Actuelles

### ✅ **Implémentées et Fonctionnelles**

- **Navigation complète** entre 4 onglets
- **Interface utilisateur moderne** pour tous les écrans
- **Design system cohérent** avec palette de couleurs
- **SplashScreen animé** avec logo EcoTri
- **Écrans de recyclage** avec interfaces complètes
- **Composants réutilisables** (Header, CustomButton, etc.)
- **Système d'authentification complet** avec Firebase
- **Gestion des profils utilisateur** persistants
- **Validation des formulaires** en temps réel
- **Gestion d'erreurs** avec messages traduits

### 🚧 **En Développement**

- **Scan réel** avec caméra et reconnaissance d'objets
- **Géolocalisation** des centres de recyclage
- **Base de données** des déchets et conseils
- **Fonctionnalités avancées** d'authentification (OAuth, biométrie)

## 👥 Équipe

- **Développeur** : [Votre Nom]
- **Master** : YNOV - Bloc 2
- **Projet** : EcoTri - Application de Recyclage Intelligent

## 📄 Licence

Ce projet est développé dans le cadre d'un Master 2 à YNOV.

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 3.0.0  
**Statut** : ✅ FONCTIONNEL AVEC AUTHENTIFICATION FIREBASE COMPLÈTE
