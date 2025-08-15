# 📚 Documentation Technique - EcoTri

**Version :** 7.0.0  
**Dernière mise à jour :** Décembre 2024

## 🎯 **Vue d'Ensemble**

Cette documentation technique couvre l'ensemble des fonctionnalités de l'application EcoTri, une solution de recyclage intelligent utilisant React Native, ML Kit et des APIs géospatiales avancées.

## 📋 **Table des Matières**

### **🚀 Fonctionnalités Principales**

#### **🏠 Page d'Accueil Intelligente**
- [Géolocalisation et API Overpass](./GEOLOCALISATION_OVERPASS.md) - Système de géolocalisation et recherche de points de recyclage
- [Navigation Intelligente](./NAVIGATION_INTELLIGENTE.md) - Détection automatique des apps de navigation installées
- [Système de Filtrage Avancé](./FILTRAGE_AVANCE.md) - Filtrage par type de recyclage et sélection de rayon dynamique

#### **📱 Interface et Navigation**
- [Changelog](./CHANGELOG.md) - Historique complet des versions et fonctionnalités
- [Architecture Navigation](./ARCHITECTURE_NAVIGATION.md) - Structure de navigation personnalisée

#### **🤖 Intelligence Artificielle**
- [ML Kit Native](./ML_KIT_NATIVE.md) - Module natif Android pour la reconnaissance d'objets
- [Service ML Kit](./SERVICE_ML_KIT.md) - Service TypeScript pour l'intégration ML Kit

### **🏗️ Architecture Technique**

#### **📱 Frontend React Native**
- [Structure du Projet](./STRUCTURE_PROJET.md) - Organisation des dossiers et fichiers
- [Composants UI](./COMPOSANTS_UI.md) - Composants réutilisables et design system
- [Styles et Thèmes](./STYLES_THEMES.md) - Système de couleurs et thèmes

#### **🔧 Backend et Services**
- [Firebase Integration](./FIREBASE_INTEGRATION.md) - Authentification et base de données
- [Services Locaux](./SERVICES_LOCAUX.md) - Gestion des statistiques et données utilisateur

### **🧪 Tests et Qualité**

#### **🔍 Tests Automatisés**
- [Tests Unitaires](./TESTS_UNITAIRES.md) - Tests des composants et services
- [Tests d'Intégration](./TESTS_INTEGRATION.md) - Tests des APIs et fonctionnalités
- [Tests de Performance](./TESTS_PERFORMANCE.md) - Validation des performances

#### **📊 Qualité et Maintenance**
- [Standards de Code](./STANDARDS_CODE.md) - Conventions et bonnes pratiques
- [Documentation API](./DOCUMENTATION_API.md) - Référence des APIs internes
- [Dépannage](./DEPANNAGE.md) - Solutions aux problèmes courants

## 🚀 **Démarrage Rapide**

### **Prérequis**
- Node.js >= 16
- React Native CLI
- Android Studio (Android)
- Xcode (iOS)

### **Installation**
```bash
git clone [repository-url]
cd EcoTri
npm install
```

### **Lancement**
```bash
# Android
npm run android

# iOS
npm run ios
```

## 🔧 **Configuration**

### **Variables d'Environnement**
```bash
# .env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
```

### **Permissions Android**
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 📱 **Fonctionnalités Clés**

### **🏠 Page d'Accueil (HomeScreen)**
- **📍 Géolocalisation automatique** avec détection de la ville
- **🗺️ Recherche de points de recyclage** via API Overpass
- **🔄 Système de fallback** Overpass → Nominatim
- **🧭 Navigation intelligente** vers les points
- **🔍 Système de filtrage avancé** par type de recyclage (verre, plastique, papier, métal, etc.)
- **📏 Sélection de rayon dynamique** (500m à 10km) avec interface moderne
- **🎨 Interface optimisée** avec filtres visuels et design épuré

### **📸 Scanner Intelligent (ScanScreen)**
- **🤖 Reconnaissance ML Kit** des types de déchets
- **📱 Module natif Android** pour performance optimale
- **📊 Classification en temps réel** avec scores de confiance
- **💾 Historique des scans** avec statistiques

### **📊 Profil et Statistiques (ProfileScreen)**
- **🏆 Système de gamification** avec points et niveaux
- **📈 Tableau de bord complet** des performances
- **🔥 Suivi des streaks** de recyclage
- **💾 Stockage local** avec AsyncStorage

## 🧪 **Tests**

### **Lancement des Tests**
```bash
# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### **Structure des Tests**
```
__tests__/
├── components/     # Tests des composants UI
├── services/       # Tests des services
├── screens/        # Tests des écrans
└── utils/          # Tests des utilitaires
```

## 🔮 **Roadmap**

### **Version 6.1.0 (Prévue)**
- **🗺️ Carte interactive** des points de recyclage
- **🔔 Notifications** de collecte et rappels
- **📊 Graphiques avancés** des statistiques

### **Version 6.2.0 (Prévue)**
- **🤖 IA avancée** : segmentation d'images et détection de pose
- **📱 Widgets** pour accès rapide
- **🌙 Mode sombre** adaptatif

## 📞 **Support et Contact**

### **Développeur**
- **Nom** : Zineb Lahmar
- **Email** : zineblahmar1@gmail.com
- **Projet** : Master 2 YNOV - Application de Recyclage Intelligent

### **Ressources**
- **Repository** : [GitHub EcoTri](https://github.com/username/ecotri)
- **Issues** : [GitHub Issues](https://github.com/username/ecotri/issues)
- **Documentation** : [Wiki du projet](https://github.com/username/ecotri/wiki)

---

**🌱 Ensemble, recyclons intelligemment pour un avenir durable !** ♻️✨

*Dernière mise à jour : Décembre 2024*
