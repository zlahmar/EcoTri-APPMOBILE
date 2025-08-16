# EcoTri CI/CD - Configuration Actuelle

## 🚀 Pipeline CI/CD Optimisé pour Android

Ce repository dispose d'un pipeline CI/CD complet configuré avec GitHub Actions, optimisé pour le développement et le déploiement d'applications Android React Native.

## 📱 Configuration Actuelle

### ✅ Fonctionnel

- **Validation et Tests** : TypeScript, ESLint, Prettier, Jest
- **Build Android** : Debug et Release (APK + AAB)
- **Tests d'Intégration** : Services, composants, écrans
- **Audit de Sécurité** : npm audit, vulnérabilités, secrets
- **Déploiement** : Firebase Staging/Production
- **Rapports de Qualité** : Génération automatique

### 🚧 Temporairement Désactivé

- **Build iOS** : Disponible dans la prochaine version

## 🏗️ Architecture du Pipeline

```
validate-and-test → build-android → integration-tests → deploy
       ↓                ↓               ↓              ↓
  security-audit → generate-report ←───────────────┘
```

## 🚀 Démarrage Rapide

### 1. Configuration des Secrets

Ajoutez ces secrets dans votre repository GitHub :

```bash
FIREBASE_TOKEN_STAGING=your_staging_token
FIREBASE_TOKEN_PRODUCTION=your_production_token
```

### 2. Déclenchement Automatique

Le pipeline se lance automatiquement sur :

- **Push** vers `main`, `develop`, `feature/*`, `hotfix/*`
- **Pull Request** vers `main` et `develop`
- **Déclenchement manuel** via GitHub Actions

### 3. Exécution Manuelle

```bash
# Via l'interface GitHub Actions
1. Aller dans Actions > EcoTri CI/CD Pipeline
2. Cliquer sur "Run workflow"
3. Sélectionner l'environnement (staging/production)
4. Lancer l'exécution
```

## 📊 Métriques de Performance

- **Temps total** : ~2 heures (Android uniquement)
- **Validation et Tests** : 30 minutes
- **Build Android** : 45 minutes (Debug + Release)
- **Tests d'Intégration** : 20 minutes
- **Audit de Sécurité** : 15 minutes
- **Déploiement** : 30 minutes

## 🔧 Configuration Technique

### Environnement Android

- **Java** : 17 (Temurin)
- **SDK Android** : 34
- **Build Tools** : 34.0.0
- **NDK** : 25.1.8937393
- **Node.js** : 18

### Cache Optimisé

- **npm** : `node_modules` et `~/.npm`
- **Gradle** : `~/.gradle/caches` et `~/.gradle/wrapper`
- **Restauration intelligente** avec clés partielles

## 📁 Structure des Fichiers

```
.github/
└── workflows/
    └── ci.yml              # Pipeline principal

doc/
├── CI_CD_GUIDE.md         # Guide complet CI/CD
├── ANDROID_BUILD_CONFIG.md # Configuration Android
└── TECHNICAL_GUIDE.md     # Guide technique général

__tests__/                  # Tests automatisés
├── services/              # Tests des services
├── components/            # Tests des composants
└── screens/               # Tests des écrans
```

## 🧪 Tests et Qualité

### Couverture Actuelle

- **Services** : 66 tests (100%)
- **Hooks** : 11 tests (100%)
- **Composants** : 73 tests (100%)
- **Écrans** : 8 tests (100%)
- **Total** : 158 tests

### Outils de Qualité

- **TypeScript** : Validation stricte
- **ESLint** : Analyse statique
- **Prettier** : Formatage automatique
- **Jest** : Framework de test
- **Codecov** : Couverture de code

## 🚀 Déploiement

### Environnements

- **Staging** : Branche `develop` ou `main` + environnement `staging`
- **Production** : Branche `main` + environnement `production`

### Plateformes

- **Firebase Hosting** : Application web
- **Firebase Functions** : Backend serverless
- **Artefacts** : APKs et AABs Android

## 📈 Monitoring et Rapports

### Rapports Automatiques

- **Rapport de qualité** : Généré après chaque exécution
- **Métriques de build** : Temps, succès, échecs
- **Artefacts** : Builds Android conservés 30 jours
- **Rapport de qualité** : Conservé 90 jours

### Intégrations

- **Codecov** : Couverture de code
- **GitHub Actions** : Logs détaillés
- **Firebase** : Déploiement automatique

## 🔍 Dépannage

### Problèmes Courants

#### Build Android Échoué

```bash
# Vérifier Java 17
java -version

# Vérifier SDK Android
echo $ANDROID_HOME

# Vérifier Gradle
cd android && ./gradlew --version
```

#### Tests Échoués

```bash
# Exécuter les tests localement
npm run test

# Vérifier la configuration Jest
npm run test:debug
```

#### Cache Problématique

```bash
# Nettoyer le cache npm
npm cache clean --force

# Nettoyer le cache Gradle
cd android && ./gradlew clean
```

## 🚧 Prochaine Version

### Support iOS

- **Activation du build iOS** : Configuration complète
- **Runner macOS** : Optimisation des performances
- **CocoaPods** : Gestion des dépendances iOS
- **Xcode** : Build et packaging automatiques

### Améliorations Planifiées

- **Tests E2E** : Appium ou Detox
- **Signing automatique** : Certificats iOS/Android
- **Deployment stores** : Google Play et App Store
- **Monitoring avancé** : Métriques de performance

## 📚 Documentation

- **[Guide CI/CD Complet](doc/CI_CD_GUIDE.md)** : Documentation détaillée du pipeline
- **[Configuration Android](doc/ANDROID_BUILD_CONFIG.md)** : Spécificités du build Android
- **[Guide Technique](doc/TECHNICAL_GUIDE.md)** : Architecture et technologies
- **[Guide Utilisateur](doc/USER_GUIDE.md)** : Utilisation de l'application

## 🤝 Contribution

### Ajout de Tests

```bash
# Créer un nouveau test
touch __tests__/services/newService.test.ts

# Exécuter les tests
npm run test

# Vérifier la couverture
npm run test:coverage
```

### Modification du Pipeline

```bash
# Éditer le pipeline
vim .github/workflows/ci.yml

# Tester localement
# Utiliser act pour tester GitHub Actions localement
```

## 📞 Support

- **Issues GitHub** : Signalement de bugs et demandes
- **Discussions** : Questions et partage d'expérience
- **Wiki** : Documentation collaborative
- **Actions** : Logs détaillés des exécutions

---

**Version** : 1.0 (Android uniquement)  
**Prochaine version** : Support iOS complet  
**Maintenu par** : Équipe DevOps EcoTri  
**Statut** : Production active
