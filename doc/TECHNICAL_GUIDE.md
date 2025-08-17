# Technical Guide - EcoTri

## Table des Matières

1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Technologies et Framework](#technologies-et-framework)
4. [Structure du Code](#structure-du-code)
5. [Services et Logique Métier](#services-et-logique-métier)
6. [Interface Utilisateur](#interface-utilisateur)
7. [Gestion des Données](#gestion-des-données)
8. [Sécurité et Authentification](#sécurité-et-authentification)
   - [Authentification et Sécurité](#authentification-et-sécurité)
   - [Gestion des Permissions](#gestion-des-permissions)
   - [Protection des Données](#protection-des-données)
   - [Protection OWASP](#protection-owasp)
   - [Accessibilité](#accessibilité)
9. [Intelligence Artificielle et ML Kit](#intelligence-artificielle-et-ml-kit)
   - [Module Natif ML Kit Android](#module-natif-ml-kit-android)
   - [Fonctionnalités ML Kit Intégrées](#fonctionnalités-ml-kit-intégrées)
   - [Configuration Technique](#configuration-technique)
10. [Configuration Firebase](#configuration-firebase)
    - [Services Configurés](#services-configurés)
    - [Configuration Android](#configuration-android)
    - [Configuration iOS](#configuration-ios)
    - [Services d'Authentification](#services-dauthentification)
    - [Base de Données Firestore](#base-de-données-firestore)
11. [Tests et Qualité](#tests-et-qualité)
12. [Performance et Optimisation](#performance-et-optimisation)
13. [Déploiement et Build](#déploiement-et-build)
14. [Maintenance et Support](#maintenance-et-support)
15. [Annexes](#annexes)

---

## Introduction

EcoTri est une application mobile de recyclage développée en React Native, conçue pour faciliter la gestion des déchets et améliorer les pratiques de recyclage des utilisateurs. Cette application s'intègre avec les services de collecte de Bordeaux Métropole et propose des fonctionnalités avancées de géolocalisation et de reconnaissance d'objets.

### Objectifs du Projet

- Simplifier le processus de recyclage pour les utilisateurs
- Intégrer les données de collecte officielles de Bordeaux Métropole
- Fournir une expérience utilisateur intuitive et accessible
- Contribuer à l'amélioration des pratiques environnementales

---

## Architecture du Projet

### Vue d'Ensemble

L'architecture d'EcoTri suit le pattern Model-View-Controller (MVC) adapté aux applications React Native, avec une séparation claire des responsabilités :

- **Model** : Services de données et logique métier
- **View** : Composants React Native et écrans
- **Controller** : Hooks personnalisés et gestion d'état

### Structure des Dossiers

```
EcoTri/                          # Racine du projet
├── src/                        # Code source principal
│   ├── components/             # Composants réutilisables
│   │   ├── common/            # Composants partagés (Header, CustomButton, etc.)
│   │   └── main/              # Composants spécifiques aux écrans principaux
│   ├── screens/               # Écrans de l'application
│   │   ├── auth/              # Écrans d'authentification (Login, Signup)
│   │   ├── main/              # Écrans principaux (Home, Profile, Splash)
│   │   └── recycling/         # Écrans de recyclage (Collecte, Scan, Conseils)
│   ├── services/              # Logique métier et API (9 services)
│   │   ├── authService.ts     # Authentification Firebase
│   │   ├── locationService.ts # Géolocalisation
│   │   ├── collecteService.ts # Données de collecte
│   │   ├── statsService.ts    # Statistiques utilisateur
│   │   ├── mlKitService.ts    # Reconnaissance d'objets
│   │   ├── iconService.ts     # Gestion des icônes
│   │   ├── firestoreService.ts # Base de données
│   │   ├── useLocation.ts     # Hook de géolocalisation
│   │   ├── firebase.ts        # Configuration Firebase
│   │   └── ...
│   ├── navigation/            # Gestion de la navigation
│   ├── styles/                # Définitions de styles et thèmes
│   └── assets/                # Ressources statiques (images, données)
├── android/                   # Configuration Android native
│   ├── app/                   # Application Android principale
│   │   ├── build.gradle       # Configuration build Android
│   │   ├── src/main/          # Code source Android natif
│   │   └── google-services.json # Configuration Firebase
│   ├── build.gradle           # Configuration Gradle projet
│   └── gradle.properties      # Propriétés Gradle
├── ios/                       # Configuration iOS native (macOS uniquement)
│   ├── EcoTri.xcodeproj/     # Projet Xcode
│   ├── Podfile               # Dépendances CocoaPods
│   └── GoogleService-Info.plist # Configuration Firebase iOS
├── doc/                       # Documentation complète
│   ├── TECHNICAL_GUIDE.md    # Guide technique (ce document)
│   ├── TESTING_GUIDE.md      # Guide des tests
│   ├── COMPETENCES_VALIDEES.md # Validation des compétences
│   ├── SCRIPTS_ET_COMMANDES.md # Scripts et commandes
│   ├── CHANGELOG.md          # Historique des versions
│   ├── USER_GUIDE.md         # Guide utilisateur
│   └── CI_CD_GUIDE.md        # Guide CI/CD
├── __tests__/                 # Tests automatisés
│   ├── components/            # Tests des composants
│   ├── services/              # Tests des services
│   ├── screens/               # Tests des écrans
│   └── hooks/                 # Tests des hooks
├── __mocks__/                 # Mocks pour les tests
├── .github/                   # Configuration GitHub Actions (CI/CD)
│   └── workflows/             # Pipelines CI/CD
├── coverage/                  # Rapports de couverture des tests
├── node_modules/              # Dépendances npm (généré)
├── package.json               # Configuration npm et scripts
├── jest.config.js             # Configuration Jest
├── tsconfig.json              # Configuration TypeScript
├── babel.config.js            # Configuration Babel
├── metro.config.js            # Configuration Metro (React Native)
├── .eslintrc.js               # Configuration ESLint
├── .prettierrc.js             # Configuration Prettier
├── .gitignore                 # Fichiers ignorés par Git
├── App.tsx                    # Point d'entrée de l'application
└── index.js                   # Point d'entrée React Native
```

### Principes d'Architecture

- **Séparation des responsabilités** : Chaque module a une responsabilité unique
- **Injection de dépendances** : Services injectés via les composants
- **Pattern Singleton** : Services partagés pour la gestion d'état
- **Composants réutilisables** : Architecture modulaire et maintenable

---

## Technologies et Framework

### Stack Technique

- **Framework** : React Native 0.72+
- **Langage** : TypeScript 5.0+
- **Gestion d'état** : React Hooks et Context API
- **Navigation** : React Navigation 6
- **Base de données** : Firebase Firestore
- **Authentification** : Firebase Auth
- **Stockage local** : AsyncStorage
- **Intelligence artificielle** : ML Kit
- **Tests** : Jest et React Native Testing Library

### Dépendances Principales

- **@react-native-firebase** : Intégration Firebase
- **react-native-geolocation-service** : Services de géolocalisation
- **react-native-vector-icons** : Icônes Material Design
- **@react-native-async-storage** : Stockage local persistant

### Comparatif des Technologies et Choix d'Architecture

#### **Pourquoi React Native ?**

| Alternative        | Avantages                            | Inconvénients                              | Choix EcoTri                                                  |
| ------------------ | ------------------------------------ | ------------------------------------------ | ------------------------------------------------------------- |
| **Flutter**        | Performance native, UI cohérente     | Courbe d'apprentissage, écosystème         | **React Native** : Équipe expérimentée, écosystème mature     |
| **Native Android** | Performance maximale, contrôle total | Développement séparé, maintenance double   | **React Native** : Code unique, maintenance simplifiée        |
| **Ionic/Cordova**  | Web technologies                     | Performance limitée, accès natif restreint | **React Native** : Performance native, accès complet aux APIs |

#### **Pourquoi Firebase ?**

| Alternative        | Avantages                        | Inconvénients                   | Choix EcoTri                                                 |
| ------------------ | -------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| **AWS Amplify**    | Services complets, scalabilité   | Complexité, coût élevé          | **Firebase** : Simplicité, gratuité, intégration Google      |
| **Supabase**       | Open source, PostgreSQL          | Écosystème moins mature         | **Firebase** : Stabilité, support Google, écosystème riche   |
| **Backend custom** | Contrôle total, personnalisation | Développement long, maintenance | **Firebase** : Rapidité de développement, maintenance Google |

#### **Pourquoi ML Kit Natif vs Firebase ML ?**

| Alternative         | Avantages                     | Inconvénients                       | Choix EcoTri                                                 |
| ------------------- | ----------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| **Firebase ML Kit** | Intégration simple, cloud     | Coût par requête, dépendance réseau | **ML Kit Natif** : Gratuit, hors ligne, performance maximale |
| **TensorFlow Lite** | Modèles personnalisés         | Complexité, taille des modèles      | **ML Kit Natif** : Prêt à l'emploi, optimisé Google          |
| **APIs cloud**      | Précision élevée, maintenance | Latence réseau, coût                | **ML Kit Natif** : < 100ms, gratuit, contrôle total          |

#### **Justification de l'Architecture MVC Adaptée**

**Pourquoi pas d'autres patterns ?**

- **Redux/MobX** : Overkill pour l'application, Hooks + Context suffisants
- **Clean Architecture** : Complexité excessive pour une app mobile
- **MVVM** : React Native suit naturellement le pattern MVC
- **Microservices** : Application mobile monolithique plus efficace

**Avantages de notre approche :**

- **Simplicité** : Facile à comprendre et maintenir
- **Performance** : Pas de surcharge d'architecture
- **Évolutivité** : Services modulaires, ajout facile de fonctionnalités
- **Tests** : Structure claire pour les tests unitaires et d'intégration

---

## Structure du Code

### Organisation des Composants

Les composants sont organisés selon une hiérarchie claire :

1. **Composants de base** : Boutons, inputs, modals
2. **Composants métier** : Spécifiques aux fonctionnalités
3. **Composants d'écran** : Assemblage des composants métier
4. **Composants de navigation** : Gestion des transitions

### Gestion des Styles

- **Système de couleurs centralisé** : Palette cohérente
- **Styles conditionnels** : Adaptation selon l'état
- **Responsive design** : Adaptation aux différentes tailles d'écran
- **Thème sombre(à venir)/clair** : Support des préférences utilisateur

---

## Services et Logique Métier

### Services Principaux

#### LocationService

Gère la géolocalisation et les permissions utilisateur :

- **Singleton pattern** : Instance unique partagée dans l'application
- **Détection automatique** : Position GPS avec précision élevée
- **Permissions intelligentes** : Gestion automatique Android/iOS
- **Reverse geocoding** : Conversion coordonnées → ville via Nominatim
- **Cache intelligent** : Évite les requêtes GPS inutiles (1 minute)
- **Hook React** : `useLocation` pour intégration facile
- **Callbacks** : Notifications automatiques des changements
- **Fallback robuste** : Gestion des erreurs et timeouts

#### CollecteService

Intègre les données de collecte de Bordeaux Métropole :

- Récupération des zones de collecte
- Recherche par commune et localisation
- Calcul des prochains passages
- Formatage des informations

#### AuthService

Gère l'authentification et les profils utilisateur :

- Connexion/inscription Firebase
- Gestion des sessions
- Validation des données
- Messages d'erreur localisés

#### LocalStatsService

Suivi des statistiques utilisateur :

- Historique des scans
- Compteurs de recyclage
- Persistance locale
- Synchronisation Firebase

### Pattern Singleton

Tous les services utilisent le pattern Singleton pour assurer une instance unique et partagée dans l'application.

---

## Interface Utilisateur

### Composants Principaux

#### Header

- Logo et titre de l'application
- Bouton de profil utilisateur
- Navigation contextuelle

#### CustomButton

- Boutons personnalisables
- États visuels (normal, pressé, désactivé)
- Support des icônes et du texte
- Animations de feedback

#### WeeklyCalendar

- Affichage du calendrier hebdomadaire
- Indication des jours de collecte
- Navigation temporelle
- Intégration avec les données de collecte

#### LocationDisplay

- Affichage de la localisation actuelle
- Bouton de rafraîchissement
- États de chargement
- Gestion des erreurs

### Navigation

- **Stack Navigation** : Navigation entre écrans
- **Tab Navigation** : Navigation principale de l'application
- **Modal Navigation** : Affichage des composants overlay
- **Deep Linking** : Navigation directe vers des fonctionnalités

### Fonctionnalités Avancées

#### Système de Filtrage Intelligent

- **8 types de filtres** : Verre, plastique, papier, métal, électronique, textile, piles, organique
- **Mots-clés multiples** : Recherche étendue avec synonymes et variations
- **Interface adaptative** : Boutons visuels avec icônes Material Design distinctes
- **Filtrage en temps réel** : Résultats instantanés sans délai réseau

#### Sélection de Rayon Dynamique

- **5 rayons configurables** : 500m à 10km selon les besoins
- **Interface compacte** : Dropdown modal avec sélection intuitive
- **Mise à jour automatique** : Recherche immédiate lors du changement
- **Intégration Overpass** : Rayon appliqué directement aux requêtes API

#### Géolocalisation et Recherche

- **API Overpass primaire** : Points de recyclage officiels OpenStreetMap
- **Fallback Nominatim** : Recherche élargie si Overpass échoue
- **Permissions intelligentes** : Gestion automatique Android/iOS
- **Précision GPS** : Combinaison GPS + réseau cellulaire

#### Navigation Intelligente

- **Détection automatique** : 10+ applications de navigation supportées
- **Interface adaptative** : Seuls les boutons des apps installées affichés
- **Fallback web** : Google Maps dans le navigateur si aucune app
- **Performance optimale** : Vérification en quelques millisecondes

---

## Gestion des Données

### Sources de Données

1. **Données locales** : AsyncStorage pour les préférences
2. **Données Firebase** : Profils utilisateur et statistiques
3. **APIs externes** : Services de géolocalisation et collecte
4. **Données statiques** : Configuration et ressources

### Modèles de Données

#### CollecteZone

```typescript
interface CollecteZone {
  gid: string;
  commune: string;
  code_commune: string;
  type: string;
  jour_col: string[];
  passage: string;
  geo_point_2d: { lat: number; lon: number };
  geo_shape: GeoJSON;
  cdate: string;
  mdate: string;
}
```

#### UserData

```typescript
interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLogin: Date;
}
```

### Persistance des Données

- **Stratégie de cache** : Données fréquemment utilisées en local
- **Synchronisation** : Mise à jour des données en arrière-plan
- **Gestion des conflits** : Résolution des modifications concurrentes
- **Nettoyage automatique** : Suppression des données obsolètes

---

## Sécurité et Authentification

### Authentification et Sécurité

- **Méthodes supportées** : Email/mot de passe, Google Sign-In
- **Validation des données** : Vérification des formats
- **Gestion des erreurs** : Messages utilisateur localisés
- **Sécurité des sessions** : Tokens JWT sécurisés
- **Structure utilisateur** : uid, email, firstName, lastName, timestamps
- **Sécurité** : Sessions persistantes, déconnexion sécurisée

_Configuration complète dans [Configuration Firebase](#configuration-firebase)._

### Gestion des Permissions

- **Géolocalisation** : Demande explicite des permissions GPS
- **Stockage** : Accès sécurisé aux données locales
- **Réseau** : Validation des appels API
- **Caméra** : Permission pour la reconnaissance d'objets ML Kit
- **Audio** : Permission pour les fonctionnalités avancées

_Configuration détaillée dans [Intelligence Artificielle et ML Kit](#intelligence-artificielle-et-ml-kit)._

### Protection des Données

- **Chiffrement local** : Données sensibles chiffrées
- **Validation serveur** : Double vérification des données
- **Audit des accès** : Logs de connexion et modifications
- **Conformité RGPD** : Gestion des données personnelles

### Protection OWASP

Les mesures de sécurité implémentées couvrent les 10 failles principales décrites par l'OWASP :

- **Injection** : Validation et sanitisation des entrées utilisateur
- **Authentification cassée** : Firebase Auth avec gestion sécurisée des sessions
- **Exposition de données sensibles** : Chiffrement des communications HTTPS
- **Contrôle d'accès défaillant** : Permissions utilisateur granulaires
- **Configuration de sécurité défaillante** : Variables d'environnement sécurisées
- **XSS** : Validation des données d'entrée et sortie
- **Injection de dépendances** : Audit automatique des vulnérabilités npm
- **Logs et monitoring insuffisants** : Traçabilité complète des actions
- **SSRF** : Validation des URLs et domaines autorisés
- **Vulnérabilités des composants** : Mise à jour automatique des dépendances

### Accessibilité

#### Référentiel Choisi : RGAA (Référentiel Général d'Amélioration de l'Accessibilité)

**Justification du choix :**

- **Standard français** : Conformité aux exigences nationales
- **Complétude** : Couvre tous les aspects d'accessibilité numérique
- **Mise à jour régulière** : Référentiel RGAA 4.1 conforme aux standards internationaux WCAG
- **Certification officielle** : Reconnaissance par les autorités publiques françaises (à venir)

#### Implémentation des Exigences RGAA

Le prototype répond aux exigences du référentiel RGAA :

- **Navigation clavier** : Tous les composants accessibles au clavier
- **Contraste des couleurs** : Ratio minimum de 4.5:1 respecté
- **Taille des textes** : Scalabilité jusqu'à 200% sans perte d'information
- **Alternatives textuelles** : Images et icônes avec descriptions
- **Structure sémantique** : Hiérarchie des titres et landmarks
- **Formulaires accessibles** : Labels associés et messages d'erreur clairs
- **Multimédia** : Sous-titres et transcriptions pour le contenu audio/vidéo (à venir)

---

## Intelligence Artificielle et ML Kit

### Module Natif ML Kit Android

#### Architecture ML Kit Complète

- **Module natif personnalisé** : MLKitModule.kt et MLKitPackage.kt
- **Intégration directe Google ML Kit** : Sans dépendance Firebase
- **Performance native maximale** : < 100ms d'analyse
- **Bridge React Native ↔ Android** : Communication optimisée
- **Gestion d'erreurs robuste** : Try-catch natif et fallback

#### Fonctionnalités ML Kit Intégrées

##### Reconnaissance d'Objets (Image Labeling)

- **API native** : `ImageLabeling.getClient()`
- **Confiance minimale** : 70% (configurable)
- **Applications** : Identification automatique des types de déchets
- **Exemples** : Bouteilles plastique, canettes métal, cartons, verre

##### Scanner de Codes-barres (Barcode Scanning)

- **API native** : `BarcodeScanning.getClient()`
- **Formats supportés** : EAN-13, EAN-8, UPC, Code 128, QR Code
- **Données retournées** : Valeur brute, affichage, format, type
- **Applications** : Identification rapide des produits

##### Reconnaissance de Texte (Text Recognition)

- **API native** : `TextRecognition.getClient()`
- **Scripts supportés** : Latin, Chinois, Devanagari, Japonais, Coréen
- **Applications** : Symboles de recyclage, codes PET, instructions
- **Précision** : Optimisée pour les emballages

##### Détection de Visages (Face Detection)

- **API native** : `FaceDetection.getClient()`
- **Mode performance** : FAST (optimisé pour la vitesse)
- **Métriques** : Rotation Y/Z, taille minimale 15%
- **Applications** : Sécurité, validation des scans

##### Analyse Complète d'Image

- **Méthode native** : `analyzeImage(imageUri)`
- **Fonctionnalité** : Lance les 4 détections en parallèle
- **Performance** : 4x plus rapide que l'analyse séquentielle
- **Résultats** : Structure unifiée avec timestamp

#### Configuration Technique

- **Dépendances Gradle** : ML Kit 17.x, CameraX 1.3.1, support complet Android
- **Permissions** : Caméra, stockage, audio configurées dans AndroidManifest.xml
- **Performance** : < 100ms d'analyse, fonctionnement hors ligne
- **Avantages** : Module natif vs Firebase ML Kit (gratuit, plus rapide, contrôle total)

_Configuration des permissions détaillée dans [Gestion des Permissions](#gestion-des-permissions)._

---

## Configuration Firebase

### Services Configurés

- **Firebase App** : Configuration de base
- **Firebase Auth** : Authentification utilisateur
- **Firebase Firestore** : Base de données
- **Firebase Storage** : Stockage de fichiers

### Configuration Android

- **Package Name** : `com.ecotri.app`
- **google-services.json** : Configuré avec le projet Firebase
- **build.gradle** : Dépendances Firebase ajoutées

#### Étapes de Configuration

1. **Créer un projet Firebase**

   - Accéder à [Firebase Console](https://console.firebase.google.com/)
   - Créer un nouveau projet ou sélectionner un projet existant
   - Activer les services Auth, Firestore et Storage

2. **Télécharger `google-services.json`**

   - Dans la console Firebase, aller dans "Paramètres du projet"
   - Section "Vos applications" → "Ajouter une application"
   - Sélectionner Android et entrer le package name `com.ecotri.app`
   - Télécharger le fichier `google-services.json`

3. **Placer le fichier dans `android/app/`**

   - Copier `google-services.json` dans le dossier `android/app/`
   - Vérifier que le fichier est bien présent et non ignoré par Git

4. **Vérifier que le package name correspond**
   - Le package name dans `google-services.json` doit correspondre à `com.ecotri.app`
   - Vérifier dans `android/app/build.gradle` que `applicationId` est correct

### Configuration iOS

- **Bundle Identifier** : `com.ecotri.app`
- **GoogleService-Info.plist** : Configuré avec le projet Firebase
- **Podfile** : Dépendances Firebase ajoutées

### Services d'Authentification

- **Méthodes supportées** : Email/mot de passe, Google Sign-In
- **Gestion des sessions** : Tokens JWT sécurisés
- **Récupération de mot de passe** : Email de réinitialisation
- **Validation des données** : Vérification des formats
- **Gestion d'erreurs** : Codes Firebase traduits en français

_Configuration complète dans [Authentification et Sécurité](#authentification-et-sécurité)._

### Base de Données Firestore

- **Structure** : Collections organisées par utilisateur
- **Sécurité** : Règles d'accès granulaires
- **Synchronisation** : Temps réel avec l'application
- **Backup** : Sauvegarde automatique quotidienne

---

## Tests et Qualité

### Stratégie de Test

L'application dispose d'un harnais de test complet couvrant **95% des fonctionnalités principales**. Pour plus de détails, consultez le [Guide de Tests](TESTING_GUIDE.md).

#### Métriques de Couverture

| Catégorie      | Tests   | Couverture | Statut |
| -------------- | ------- | ---------- | ------ |
| **Services**   | 66      | 100%       | ✅     |
| **Hooks**      | 11      | 100%       | ✅     |
| **Composants** | 73      | 100%       | ✅     |
| **Écrans**     | 2       | 25%        | 🔄     |
| **Total**      | **152** | **95%**    | **🔄** |

#### Outils et Qualité

- **Framework** : Jest + React Native Testing Library
- **Mocks** : Simulation ciblée des dépendances
- **Qualité** : TypeScript, ESLint, Prettier, Husky
- **CI/CD** : Tests automatisés dans le pipeline GitHub Actions

---

## Performance et Optimisation

### Métriques de Performance

- **Temps de démarrage** : < 3 secondes
- **Rendu des composants** : < 16ms par frame
- **Mémoire** : < 100MB en utilisation normale
- **Batterie** : Optimisation des services en arrière-plan

### Techniques d'Optimisation

- **Lazy loading** : Chargement différé des composants
- **Memoization** : Cache des calculs coûteux
- **Virtualisation** : Rendu efficace des listes longues
- **Image optimization** : Compression et cache des images

### Monitoring

- **Crashlytics** : Suivi des erreurs en production
- **Performance Monitoring** : Métriques de performance Firebase
- **Analytics** : Suivi de l'utilisation des fonctionnalités
- **Logs structurés** : Traçabilité des opérations

---

## Déploiement et Build

### Infrastructure CI/CD

L'application EcoTri dispose d'un **pipeline CI/CD complet** configuré avec GitHub Actions. Pour plus de détails, consultez le [Guide CI/CD](CI_CD_GUIDE.md).

#### **Pipeline Principal (7 Jobs)**

| Job                   | Durée  | Description                                      |
| --------------------- | ------ | ------------------------------------------------ |
| **validate-and-test** | 30 min | Validation TypeScript, ESLint, tests (152 tests) |
| **build-android**     | 45 min | Build Debug/Release avec cache intelligent       |
| **build-ios**         | -      | Temporairement désactivé (version future)        |
| **integration-tests** | 20 min | Tests d'intégration et composants                |
| **security-audit**    | 15 min | npm audit, vulnérabilités, secrets               |
| **deploy**            | 30 min | Déploiement Firebase (Staging/Production)        |
| **generate-report**   | 10 min | Rapports de qualité et métriques                 |

#### **Environnements et Déclencheurs**

- **Environnements** : Development → Staging → Production
- **Déclenchement** : Push sur `main`, `dev`, `feature/*` + Pull Requests
- **Manuel** : Interface GitHub Actions avec sélection d'environnement

### Configuration de Build

#### **Environnement Android Optimisé**

| Composant       | Version      | Description                       |
| --------------- | ------------ | --------------------------------- |
| **Java**        | 17 (Temurin) | Distribution optimisée pour CI/CD |
| **SDK Android** | 34           | Version stable et supportée       |
| **Build Tools** | 34.0.0       | Outils de compilation optimisés   |
| **NDK**         | 25.1.8937393 | Support natif complet             |
| **Node.js**     | 18           | Runtime JavaScript                |

#### **Build Matrix et Cache**

- **Matrix** : Debug (développement) + Release (production)
- **Formats** : APK et AAB (Android App Bundle)
- **Cache** : Gradle + npm avec restauration optimisée
- **Performance** : Builds parallèles avec cache intelligent

### Processus de Déploiement

#### **Validation et Build**

- **Validation** : TypeScript, ESLint, Prettier, Tests (152 tests)
- **Build Android** : Matrix Debug/Release avec artefacts
- **Tests** : Intégration + Audit de sécurité automatique

#### **Déploiement et Conservation**

- **Staging** : Branche `dev` + environnement `staging`
- **Production** : Branche `main` + environnement `production`
- **Artefacts** : APKs/AABs conservés 30 jours
- **Rapports** : Qualité et métriques conservés 90 jours

### Monitoring et Rapports

#### **Intégrations Automatiques**

- **Codecov** : Couverture des tests avec flags `unittests`
- **Rapports** : Tests, builds, métriques, audit de sécurité
- **Gestion d'erreur** : Non-bloquant pour éviter les échecs de pipeline

### Support iOS Temporaire

#### **Statut Actuel et Futur**

- **Version actuelle** : Job iOS désactivé (`if: false`)
- **Structure** : Configuration préservée pour activation future
- **Prochaine version** : Support iOS complet avec Xcode, CocoaPods
- **Déploiement** : App Store Connect et distribution

### Gestion des Versions

- **Versioning** : Semantic Versioning (MAJOR.MINOR.PATCH)
- **Documentation** : Changelog complet des modifications
- **Gestion** : Rollback et hotfix d'urgence

### APKs et Tests

#### **Où trouver les APKs générés ?**

**APKs du pipeline CI/CD :**

- **GitHub Actions** : [Actions](https://github.com/zineblahmar/EcoTri/actions) → Workflow "EcoTri CI/CD Pipeline" → Artifacts
- **APK Debug** : `android-build-debug` (toutes les branches)
- **APK Release** : `android-build-release` (branche `main` uniquement)

**APKs locaux (développement) :**

```bash
# Build Debug
./gradlew assembleDebug
# APK : android/app/build/outputs/apk/debug/app-debug.apk

# Build Release
./gradlew assembleRelease
# APK : android/app/build/outputs/apk/release/app-release.apk
```

#### **Différences entre Debug et Release**

**APK Debug (développement) :**

- **Metro requis** : `npx react-native start`
- **Hot Reload** : Modifications en temps réel
- **Débogage** : Console, logs détaillés
- **Installation** : `npx react-native run-android`
- **Performance** : Non optimisée (débogage activé)

**APK Release (production) :**

- **Metro non requis** : Fonctionne de manière autonome
- **Pas de Hot Reload** : Code figé
- **Performance optimisée** : Prêt pour distribution
- **Installation** : `adb install app-release.apk`
- **Taille** : Optimisée et minifiée

#### **Stratégie de Build Intelligente**

Le pipeline utilise une stratégie de build conditionnelle :

- **Debug** : Sur toutes les branches (développement rapide)
- **Release** : Seulement sur `main` (production validée)
- **Économie** : ~50% de temps de build sur les branches de dev
- **Artefacts** : APKs et AABs automatiquement générés et uploadés

---

## Maintenance et Support

### **Gestion des Mises à Jour**

- **Automatique** : Via les stores avec préservation des données
- **Compatibilité** : Support des versions Android/iOS récentes
- **Documentation** : Guides de mise à jour complets

### **Support et Monitoring**

- **Support** : Documentation, FAQ, support communautaire
- **Monitoring** : Santé de l'app, alertes automatiques, dashboards
- **Rapports** : Analyses périodiques et métriques de production

---

## Annexes

### **Documentation Complète**

- **Guides** : [User Guide](USER_GUIDE.md), [Testing Guide](TESTING_GUIDE.md), [CI/CD Guide](CI_CD_GUIDE.md)
- **Structure** : Repository GitHub avec branches, PR, releases
- **Support** : Équipe EcoTri, documentation, issues GitHub

---

**Dernière mise à jour** : Août 2025  
**Version du document** : 3.0 (Optimisé)  
**Maintenu par** : Équipe EcoTri  
**Statut** : Approuvé et en production
