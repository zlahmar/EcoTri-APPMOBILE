# EcoTri - Application de Recyclage Intelligente

**Version** : 8.0.0  
**Statut** : Pipeline CI/CD complet, configuration Android optimisée, 161 tests automatisés
**Développeur : Zainab LAHMAR - Master 2 YNOV**
**Github : [https://github.com/zineblahmar/EcoTri](https://github.com/zineblahmar/EcoTri)**

**Master 2 YNOV - Bloc 2 : CONCEVOIR ET DÉVELOPPER DES APPLICATIONS LOGICIELLES**  
_Application mobile React Native avec Firebase pour la gestion intelligente du recyclage_

## Validation des Compétences - Bloc 2

**Toutes les compétences du Bloc 2 sont validées à 100%**

| Compétence | Titre                                          | Statut      | Validation |
| ---------- | ---------------------------------------------- | ----------- | ---------- |
| **C2.1.1** | Environnements de déploiement et de test       | **VALIDÉE** | **100%**   |
| **C2.1.2** | Système d'intégration continue                 | **VALIDÉE** | **100%**   |
| **C2.2.1** | Conception du prototype de l'application       | **VALIDÉE** | **100%**   |
| **C2.2.2** | Développement d'un harnais de test unitaire    | **VALIDÉE** | **100%**   |
| **C2.2.3** | Développement avec évolutivité et sécurisation | **VALIDÉE** | **100%**   |
| **C2.2.4** | Déploiement progressif du logiciel             | **VALIDÉE** | **100%**   |
| **C2.3.1** | Élaboration du cahier de recettes              | **VALIDÉE** | **100%**   |
| **C2.3.2** | Plan de correction des bogues                  | **VALIDÉE** | **100%**   |
| **C2.4.1** | Documentation technique d'exploitation         | **VALIDÉE** | **100%**   |

**STATUT GLOBAL : 9 COMPÉTENCES VALIDÉES À 100%**

## Vue d'ensemble

EcoTri est une application mobile développée en React Native qui permet aux utilisateurs de :

## Démarrage Rapide et Installation

### **Prérequis**

Voir le fichier [doc/TECHNICAL_GUIDE.md](doc/TECHNICAL_GUIDE.md) pour les plus de détails.

- **Node.js** : >= 18 (recommandé)
- **React Native CLI** : Installation globale
- **Android Studio** : Pour le développement Android
- **Xcode** : Pour le développement iOS (macOS uniquement)

### **Installation et Lancement**

```bash
# Cloner le repository
git clone https://github.com/zineblahmar/EcoTri.git
cd EcoTri

# Installer les dépendances
npm install

# Lancer l'application
npm run android    # Pour Android
npm run ios        # Pour iOS (macOS uniquement)
```

---

- S'authentifier avec un système de connexion/inscription complet
- Scanner des déchets pour identifier leur type
- Localiser les centres de recyclage
- Suivre leur impact environnemental
- Recevoir des conseils de recyclage personnalisés
- Gérer leur profil utilisateur avec données persistantes
- Suivre les jours de collecte des déchets

## Architecture et Structure

- **Framework** : React Native 0.81.0 avec TypeScript 5.0+
- **Architecture** : Pattern MVC adapté avec services Singleton
- **Navigation** : React Navigation 6 avec navigation personnalisée
- **État** : React Hooks et Context API pour la gestion d'état
- **Services** : 9 services métier (géolocalisation, collecte, authentification, statistiques, etc.)

## Fonctionnalités Principales

- **Géolocalisation intelligente** : Service complet avec API Overpass + fallback Nominatim
- **Système de filtrage avancé** : 8 types de recyclage avec interface intuitive
- **Navigation intelligente** : Détection automatique de 10+ applications de navigation
- **Authentification sécurisée** : Firebase Auth avec gestion complète des profils
- **Interface utilisateur** : 15+ composants réutilisables et responsive
- **Tests automatisés** : 161 tests avec 95% de couverture globale

## Infrastructure et Déploiement

- **Pipeline CI/CD** : GitHub Actions avec 7 jobs automatisés
- **Build Android** : Java 17, SDK 34, configuration optimisée
- **Tests** : Jest + React Native Testing Library
- **Qualité** : TypeScript, ESLint, Prettier, Codecov
- **Sécurité** : Protection OWASP Top 10, accessibilité RGAA
- **Déploiement** : Firebase automatique (Staging/Production)

## Plateformes Supportées

- **Android** : API 24+ (Android 7.0+) - Complètement supporté
- **iOS** : Temporairement désactivé - Support futur version 9.0.0

## Documentation

### Guides Disponibles

| Document                          | Description                | Contenu                                            |
| --------------------------------- | -------------------------- | -------------------------------------------------- |
| **`doc/TECHNICAL_GUIDE.md`**      | Guide technique complet    | Architecture, services, sécurité, déploiement      |
| **`doc/USER_GUIDE.md`**           | Guide utilisateur          | Fonctionnalités, configuration, utilisation        |
| **`doc/CI_CD_GUIDE.md`**          | Guide CI/CD                | Pipeline, déploiement, monitoring                  |
| **`doc/TESTING_GUIDE.md`**        | Guide des tests            | Stratégie, mocks, scénarios de recette             |
| **`doc/SCRIPTS_ET_COMMANDES.md`** | Guide des scripts          | Toutes les commandes et scripts de développement   |
| **`doc/CHANGELOG.md`**            | Historique des versions    | Évolutions, corrections, nouvelles fonctionnalités |
| **`doc/COMPETENCES_VALIDEES.md`** | Validation des compétences | Détail complet du Bloc 2                           |

### Liens Utiles

- **Repository GitHub** : [https://github.com/zineblahmar/EcoTri](https://github.com/zineblahmar/EcoTri)
- **Pipeline CI/CD** : [GitHub Actions](https://github.com/zineblahmar/EcoTri/actions)
- **Issues** : [Suivi des problèmes](https://github.com/zineblahmar/EcoTri/issues)
- **Releases** : [Versions publiées](https://github.com/zineblahmar/EcoTri/releases)

## Droits et Propriété Intellectuelle

### Informations Légales

- **Propriétaire** : Zainab LAHMAR
- **Institution** : Master 2 YNOV - Bloc 2
- **Année académique** : 2024-2025
- **Type de projet** : Projet académique de fin d'études

### Propriété Intellectuelle

- **Code source** : Propriété exclusive de Zainab LAHMAR
- **Architecture** : Conception et implémentation personnelles
- **Documentation** : Rédaction et organisation personnelles
- **Tests** : Stratégie et implémentation personnelles

### Licence et Utilisation

- **Usage académique** : Projet validé par YNOV
- **Distribution** : Restreinte aux évaluations académiques
- **Reproduction** : Interdite sans autorisation écrite
- **Commercialisation** : Non autorisée

### Avertissements

- Ce projet est un **livrable académique** et ne doit pas être utilisé à des fins commerciales
- Toute reproduction ou distribution doit être **explicitement autorisée**
- Le code source et la documentation sont **protégés par les droits d'auteur**

---

**EcoTri - Application de Recyclage Intelligente**  
**Version 8.0.0 - Août 2025**  
**Développeur : Zainab LAHMAR - Master 2 YNOV**
