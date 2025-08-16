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

- Détection automatique de la position
- Gestion des permissions Android/iOS
- Reverse geocoding avec Nominatim
- Calculs de distance et zones

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

### Configuration EAS Build

- **Build automatique** : Intégration continue
- **Environnements** : Development, Staging, Production
- **Signing automatique** : Certificats de signature
- **Tests automatisés** : Validation avant déploiement

### Processus de Déploiement

1. **Validation des tests** : Exécution de la suite de tests
2. **Build de production** : Compilation optimisée
3. **Tests de régression** : Validation des fonctionnalités
4. **Déploiement progressif** : Rollout par étapes

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
