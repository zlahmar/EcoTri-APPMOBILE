# 🚀 Scripts et Commandes - EcoTri

**Version :** 8.0.0  
**Dernière mise à jour :** Août 2025  
**Environnement :** Windows PowerShell

## 📋 **Table des Matières**

- [Vérification de l'Environnement](#-vérification-de-lenvironnement)
- [Gestion des Dépendances](#-gestion-des-dépendances)
- [Tests Automatisés](#-tests-automatisés)
- [Qualité du Code](#-qualité-du-code)
- [Configuration Android](#-configuration-android)
- [Configuration TypeScript](#-configuration-typescript)
- [Configuration Jest](#-configuration-jest)
- [Configuration ESLint](#-configuration-eslint)
- [Configuration Prettier](#-configuration-prettier)
- [Démarrage et Build](#-démarrage-et-build)
- [Commandes Utiles](#-commandes-utiles)

---

## 🔍 **Vérification de l'Environnement**

### **Versions des Outils**

```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier React Native CLI
npx react-native --version
```

**Résultats attendus :**

- **Node.js** : >= 18.0.0 (recommandé : 22.1.0+)
- **npm** : >= 8.0.0 (recommandé : 10.7.0+)
- **React Native CLI** : 20.0.0+

---

## 📦 **Gestion des Dépendances**

### **Installation des Dépendances**

```bash
# Installer toutes les dépendances
npm install

# Installer une dépendance spécifique
npm install nom-du-package

# Installer une dépendance de développement
npm install --save-dev nom-du-package

# Installer avec gestion des conflits
npm install --legacy-peer-deps
```

### **Gestion des Conflits**

```bash
# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement les vulnérabilités
npm audit fix

# Corriger les vulnérabilités avec mise à jour majeure
npm audit fix --force
```

### **Nettoyage et Réinstallation**

```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
npm install
```

---

## 🧪 **Tests Automatisés**

### **Commandes de Test Principales**

```bash
# Lancer tous les tests
npm test

# Tests en mode watch (redémarrage automatique)
npm run test:watch

# Tests avec couverture de code
npm run test:coverage

# Tests en mode verbeux
npm run test:verbose

# Tests avec détection des fuites mémoire
npm run test:debug
```

### **Commandes Jest Directes**

```bash
# Lancer Jest directement
npx jest

# Tests avec options spécifiques
npx jest --passWithNoTests

# Tests d'un fichier spécifique
npx jest __tests__/components/Header.test.tsx

# Tests avec pattern de nom
npx jest --testNamePattern="Header"

# Tests avec détection des handles ouverts
npx jest --detectOpenHandles --forceExit
```

### **Configuration Jest**

```bash
# Afficher la configuration Jest
npx jest --showConfig

# Vérifier la configuration TypeScript
npx tsc --showConfig
```

---

## 🔧 **Qualité du Code**

### **Linting avec ESLint**

```bash
# Linter tout le projet
npm run lint

# Linter avec ESLint directement
npx eslint .

# Linter un fichier spécifique
npx eslint src/App.tsx

# Linter avec affichage de la configuration
npx eslint --print-config src/App.tsx

# Corriger automatiquement les erreurs
npx eslint . --fix
```

### **Formatage avec Prettier**

```bash
# Vérifier le formatage
npx prettier --check src/**/*.tsx

# Formater tous les fichiers
npx prettier --write src/**/*.tsx

# Formater un fichier spécifique
npx prettier --write src/App.tsx

# Afficher la configuration Prettier
npx prettier --config-precedence prefer-file --find-config-path src/App.tsx
```

### **Vérification TypeScript**

```bash
# Vérifier la syntaxe TypeScript (sans compilation)
npx tsc --noEmit

# Vérifier la configuration TypeScript
npx tsc --showConfig

# Compiler TypeScript en JavaScript
npx tsc
```

---

## 🤖 **Configuration Android**

### **React Native Doctor**

```bash
# Vérifier l'environnement de développement
npx react-native doctor

# Vérifier spécifiquement Android
npx react-native doctor --platform android
```

### **Gradle**

```bash
# Aller dans le dossier Android
cd android

# Vérifier la version de Gradle
./gradlew --version

# Nettoyer le projet
./gradlew clean

# Build en mode debug
./gradlew assembleDebug

# Build en mode release
./gradlew assembleRelease

# Installer sur appareil connecté
./gradlew installDebug
```

### **Retour au répertoire racine**

```bash
# Retourner au répertoire principal
cd ..
```

---

## 📱 **Configuration TypeScript**

### **Vérification de la Configuration**

```bash
# Afficher la configuration TypeScript
npx tsc --showConfig

# Vérifier la syntaxe sans compilation
npx tsc --noEmit

# Compiler avec options spécifiques
npx tsc --target es2020 --module commonjs
```

### **Gestion des Types**

```bash
# Installer des types manquants
npm install --save-dev @types/node

# Vérifier les types installés
npm list @types/*
```

---

## 🎯 **Configuration Jest**

### **Vérification de la Configuration**

```bash
# Afficher la configuration Jest
npx jest --showConfig

# Vérifier l'environnement de test
npx jest --testEnvironment node

# Tests avec coverage détaillée
npx jest --coverage --coverageReporters=text-lcov
```

### **Options de Test Avancées**

```bash
# Tests avec timeout personnalisé
npx jest --testTimeout=10000

# Tests avec maximum de workers
npx jest --maxWorkers=4

# Tests avec détection des fuites
npx jest --detectLeaks --detectOpenHandles
```

---

## 🔍 **Configuration ESLint**

### **Vérification de la Configuration**

```bash
# Afficher la configuration ESLint
npx eslint --print-config src/App.tsx

# Linter avec règles spécifiques
npx eslint . --rule "no-console: error"

# Linter avec formatage personnalisé
npx eslint . --format=compact
```

### **Règles et Options**

```bash
# Linter avec ignore des warnings
npx eslint . --quiet

# Linter avec maximum d'erreurs
npx eslint . --max-warnings=0

# Linter avec cache
npx eslint . --cache
```

---

## ✨ **Configuration Prettier**

### **Vérification et Formatage**

```bash
# Vérifier le formatage
npx prettier --check "src/**/*.{ts,tsx}"

# Formater tous les fichiers
npx prettier --write "src/**/*.{ts,tsx}"

# Formater avec configuration spécifique
npx prettier --config .prettierrc.js --write src/
```

### **Configuration et Options**

```bash
# Afficher la configuration utilisée
npx prettier --config-precedence prefer-file --find-config-path src/App.tsx

# Formater avec options inline
npx prettier --single-quote --trailing-comma=all --write src/
```

---

## 🚀 **Démarrage et Build**

### **Metro Bundler**

```bash
# Démarrer Metro Bundler
npm start

# Démarrer avec options spécifiques
npx react-native start --reset-cache

# Démarrer sur un port spécifique
npx react-native start --port 8082
```

### **Vérification des Ports**

```bash
# Vérifier si Metro est en cours d'exécution (Windows)
netstat -an | findstr :8081

# Vérifier les processus Metro
tasklist | findstr node
```

### **Build et Déploiement**

```bash
# Build Android
npm run android

# Build iOS (macOS uniquement)
npm run ios

# Build avec options spécifiques
npx react-native run-android --variant=release
```

---

## 🛠️ **Commandes Utiles**

### **Nettoyage et Maintenance**

```bash
# Nettoyer le cache Metro
npx react-native start --reset-cache

# Nettoyer le cache npm
npm cache clean --force

# Nettoyer le cache Gradle
cd android && ./gradlew clean && cd ..

# Supprimer les builds
rm -rf android/app/build
```

### **Débogage et Diagnostic**

```bash
# Vérifier les processus en cours
tasklist | findstr node

# Vérifier l'utilisation des ports
netstat -an | findstr :8081

# Vérifier l'espace disque
dir

# Vérifier les permissions
icacls .
```

### **Gestion des Fichiers**

```bash
# Lister les fichiers de test
dir __tests__ /s

# Lister les composants
dir src\components /s

# Lister les services
dir src\services /s

# Rechercher des fichiers
dir /s *.test.tsx
```

---

## 📊 **Résultats Attendus des Tests**

### **Tests de Base**

```bash
npm test
# Résultat attendu :
# Test Suites: 16 passed, 16 total
# Tests:       161 passed, 161 total
# Snapshots:   0 total
# Time:        4-6 secondes
```

### **Tests avec Couverture**

```bash
npm run test:coverage
# Résultat attendu :
# Tous les tests passent avec couverture de code
# Rapport généré dans coverage/
```

### **Linting**

```bash
npm run lint
# Résultat attendu :
# Moins de 20 problèmes (erreurs + warnings)
# Problèmes principalement dans les tests
```

---

## ⚠️ **Résolution des Problèmes Courants**

### **Erreurs de Dépendances**

```bash
# Conflit de versions React
npm install --legacy-peer-deps

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### **Erreurs de Tests**

```bash
# Tests qui ne se terminent pas
npm run test:debug

# Tests avec reset complet
npx jest --clearCache
npm test
```

### **Erreurs de Build**

```bash
# Nettoyer Gradle
cd android && ./gradlew clean && cd ..

# Reset cache Metro
npx react-native start --reset-cache
```

---

## 🎯 **Checklist de Validation**

### **Avant de Commencer**

- [ ] Node.js >= 18 installé
- [ ] npm >= 8 installé
- [ ] React Native CLI installé
- [ ] Android Studio configuré (pour Android)
- [ ] Variables d'environnement configurées

### **Tests de Fonctionnement**

- [ ] `npm install` : Succès
- [ ] `npm test` : 161 tests passent
- [ ] `npm run lint` : < 20 problèmes
- [ ] `npx tsc --noEmit` : < 30 erreurs
- [ ] `npx prettier --check` : Aucun problème
- [ ] `npx react-native doctor` : Environnement OK
- [ ] `./gradlew clean` : Build Android OK
- [ ] `npm start` : Metro démarre sur port 8081

### **Validation Finale**

- [ ] Tous les tests passent (16 suites, 161 tests)
- [ ] Qualité du code acceptable
- [ ] Build Android fonctionnel
- [ ] Metro Bundler opérationnel
- [ ] Documentation à jour

---

## 📚 **Ressources et Références**

### **Documentation Officielle**

- [React Native CLI](https://github.com/react-native-community/cli)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint Configuration](https://eslint.org/)
- [Prettier Code Formatter](https://prettier.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Commandes de Référence**

- [React Native Commands](https://reactnative.dev/docs/commands)
- [Gradle Commands](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [npm Commands](https://docs.npmjs.com/cli/v8/commands)

---

**🌱 Ensemble, recyclons intelligemment pour un avenir durable !** ♻️✨

_Dernière mise à jour : Août 2025_
