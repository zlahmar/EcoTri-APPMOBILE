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
   - [Authentification Firebase](#authentification-firebase)
   - [Gestion des Permissions](#gestion-des-permissions)
   - [Protection des Données](#protection-des-données)
   - [Protection OWASP](#protection-owasp)
   - [Accessibilité](#accessibilité)
9. [Tests et Qualité](#tests-et-qualité)
10. [Performance et Optimisation](#performance-et-optimisation)
11. [Déploiement et Build](#déploiement-et-build)
12. [Maintenance et Support](#maintenance-et-support)
13. [Annexes](#annexes)

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
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants partagés
│   └── screens/        # Écrans de l'application
├── services/           # Logique métier et API
├── hooks/              # Hooks React personnalisés
├── styles/             # Définitions de styles
├── utils/              # Fonctions utilitaires
└── assets/             # Ressources statiques
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
- **Tests** : Jest et React Native Testing Library

### Dépendances Principales

- **@react-native-firebase** : Intégration Firebase
- **react-native-geolocation-service** : Services de géolocalisation
- **react-native-vector-icons** : Icônes Material Design
- **@react-native-async-storage** : Stockage local persistant

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
- **Thème sombre/clair** : Support des préférences utilisateur

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

### Authentification Firebase

- **Méthodes supportées** : Email/mot de passe
- **Validation des données** : Vérification des formats
- **Gestion des erreurs** : Messages utilisateur localisés
- **Sécurité des sessions** : Tokens JWT sécurisés

### Gestion des Permissions

- **Géolocalisation** : Demande explicite des permissions
- **Stockage** : Accès sécurisé aux données locales
- **Réseau** : Validation des appels API
- **Caméra** : Permission pour la reconnaissance d'objets

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
- **Mise à jour régulière** : Version 4.1 conforme aux standards internationaux
- **Certification officielle** : Reconnaissance par les autorités publiques

#### Implémentation des Exigences RGAA

Le prototype répond aux exigences du référentiel RGAA :

- **Navigation clavier** : Tous les composants accessibles au clavier
- **Contraste des couleurs** : Ratio minimum de 4.5:1 respecté
- **Taille des textes** : Scalabilité jusqu'à 200% sans perte d'information
- **Alternatives textuelles** : Images et icônes avec descriptions
- **Structure sémantique** : Hiérarchie des titres et landmarks
- **Formulaires accessibles** : Labels associés et messages d'erreur clairs
- **Multimédia** : Sous-titres et transcriptions pour le contenu audio/vidéo

---

## Tests et Qualité

### Stratégie de Test

L'application dispose d'un harnais de test complet couvrant 100% des fonctionnalités principales :

#### Tests Unitaires

- **Services** : 66 tests (100% de couverture)
- **Hooks** : 11 tests (100% de couverture)
- **Composants** : 73 tests (100% de couverture)
- **Écrans** : 8 tests (100% de couverture)

#### Outils de Test

- **Jest** : Framework de test principal
- **React Native Testing Library** : Tests des composants
- **Mocks ciblés** : Simulation des dépendances
- **Tests de robustesse** : Gestion des cas d'erreur

### Qualité du Code

- **TypeScript** : Typage strict et validation
- **ESLint** : Règles de qualité du code
- **Prettier** : Formatage automatique
- **Husky** : Hooks Git pour la validation

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

#### **Pipeline GitHub Actions**

L'application EcoTri dispose d'un pipeline CI/CD complet configuré avec GitHub Actions, comprenant 7 jobs automatisés :

```yaml
# Pipeline principal avec 7 jobs
jobs:
  - validate-and-test # Validation et tests (30 min)
  - build-android # Build Android (45 min)
  - build-ios # Temporairement désactivé
  - integration-tests # Tests d'intégration (20 min)
  - security-audit # Audit de sécurité (15 min)
  - deploy # Déploiement (30 min)
  - generate-report # Rapport de qualité (10 min)
```

#### **Environnements Supportés**

- **Development** : Tests et validation en cours de développement
- **Staging** : Tests d'intégration et validation pré-production
- **Production** : Déploiement final vers l'environnement de production

#### **Déclencheurs Automatiques**

- **Push automatique** : Sur les branches `main`, `develop`, `feature/*`, `hotfix/*`
- **Pull Request** : Sur les branches `main` et `develop`
- **Déclenchement manuel** : Via l'interface GitHub Actions avec sélection d'environnement

### Configuration de Build

#### **Environnement Android Optimisé**

- **Java** : Version 17 (Temurin) - Distribution optimisée pour CI/CD
- **SDK Android** : Version 34
- **Build Tools** : Version 34.0.0
- **NDK** : Version 25.1.8937393
- **Node.js** : Version 18

#### **Build Matrix Android**

```yaml
strategy:
  matrix:
    build-type: [debug, release]
```

- **Debug** : Version de développement avec logs et debugging
- **Release** : Version de production optimisée
- **Formats de sortie** : APK et AAB (Android App Bundle)

#### **Cache Intelligent**

- **Cache Gradle** : `~/.gradle/caches` et `~/.gradle/wrapper`
- **Cache npm** : `node_modules` et `~/.npm`
- **Restauration optimisée** : Clés partielles pour optimiser les builds

### Processus de Déploiement

#### **Validation Automatique**

- **TypeScript** : `tsc --noEmit` avec vérification stricte
- **ESLint** : Analyse statique du code
- **Prettier** : Vérification du formatage
- **Tests** : Exécution automatique avec couverture

#### **Build et Tests**

- **Build Android** : Matrix Debug/Release avec upload d'artefacts
- **Tests d'intégration** : Services, composants, écrans
- **Audit de sécurité** : npm audit, vulnérabilités, analyse de secrets

#### **Déploiement Firebase**

- **Staging** : Branche `develop` ou `main` + environnement `staging`
- **Production** : Branche `main` + environnement `production`
- **Artefacts** : APKs et AABs conservés 30 jours
- **Rapports** : Qualité et métriques conservés 90 jours

### Monitoring et Rapports

#### **Codecov Integration**

- **Fichier de couverture** : `./coverage/lcov.info`
- **Flags** : `unittests`
- **Nom** : `codecov-umbrella`
- **Gestion d'erreur** : Non-bloquant

#### **Rapports de Qualité Automatiques**

Le pipeline génère automatiquement un rapport de qualité incluant :

- Résultats des tests et métriques de couverture
- Statut des builds (Android Debug/Release)
- Métriques de l'application (composants, services, écrans)
- Audit de sécurité et vérification des vulnérabilités

### Support iOS Temporaire

#### **Configuration Préservée**

- **Job iOS** : Désactivé avec `if: false` pour la version actuelle
- **Structure préservée** : Prêt pour activation dans la prochaine version
- **Runner macOS** : Optimisation des performances pour iOS
- **CocoaPods** : Gestion des dépendances iOS

#### **Activation Future**

- **Prochaine version** : Support iOS complet
- **Configuration** : Xcode, CocoaPods, certificats de signature
- **Build** : Applications iOS (Debug et Release)
- **Deployment** : App Store Connect

### Gestion des Versions

- **Semantic Versioning** : MAJOR.MINOR.PATCH
- **Changelog** : Documentation des modifications
- **Rollback** : Retour aux versions précédentes
- **Hotfix** : Corrections d'urgence

---

## Maintenance et Support

### Mises à Jour

- **Mises à jour automatiques** : Via les stores
- **Compatibilité** : Support des versions Android/iOS récentes
- **Migration des données** : Préservation des données utilisateur
- **Documentation** : Guides de mise à jour

### Support Technique

- **Documentation utilisateur** : Guides et tutoriels
- **FAQ** : Questions fréquemment posées
- **Support communautaire** : Forum et discussions
- **Contact support** : Assistance technique directe

### Monitoring en Production

- **Santé de l'application** : Métriques de disponibilité
- **Alertes automatiques** : Notification des problèmes
- **Dashboards** : Visualisation des métriques
- **Rapports** : Analyses périodiques

---

## Annexes

### Guides Disponibles

- **User Guide** : Guide utilisateur complet
- **API Documentation** : Documentation des services
- **Deployment Guide** : Guide de déploiement
- **Testing Guide** : Guide des tests

### Structure du Projet

- **Repository** : Organisation du code source
- **Branches** : Stratégie de développement
- **Pull Requests** : Processus de revue de code
- **Releases** : Gestion des versions

### Contacts et Support

- **Équipe de développement** : EcoTri Team
- **Mainteneur principal** : Lead Developer
- **Documentation** : Repository GitHub
- **Issues** : Suivi des problèmes et demandes

---

**Dernière mise à jour** : Janvier 2025  
**Version du document** : 2.0  
**Maintenu par** : Équipe EcoTri  
**Statut** : Approuvé et en production
