# Configuration Build Android - EcoTri

## Vue d'Ensemble

Ce document décrit la configuration spécifique pour le build Android de l'application EcoTri. La configuration iOS est temporairement désactivée et sera disponible dans la prochaine version.

## Configuration Actuelle

### Environnement de Build

- **Runner** : `ubuntu-latest`
- **Java** : Version 17 (Temurin)
- **SDK Android** : Version 34
- **Build Tools** : Version 34.0.0
- **NDK** : Version 25.1.8937393
- **Node.js** : Version 18

### Dépendances Requises

```yaml
env:
  JAVA_VERSION: '17'
  ANDROID_SDK_VERSION: '34'
  ANDROID_BUILD_TOOLS_VERSION: '34.0.0'
  ANDROID_NDK_VERSION: '25.1.8937393'
```

## Processus de Build

### 1. Configuration de l'Environnement

```yaml
- name: Configuration de Java
  uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: ${{ env.JAVA_VERSION }}

- name: Configuration du SDK Android
  uses: android-actions/setup-android@v2
  with:
    sdk-platform: ${{ env.ANDROID_SDK_VERSION }}
    build-tools: ${{ env.ANDROID_BUILD_TOOLS_VERSION }}
    ndk: ${{ env.ANDROID_NDK_VERSION }}
```

### 2. Variables d'Environnement Android

```bash
echo "ANDROID_HOME=$ANDROID_HOME" >> $GITHUB_ENV
echo "ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT" >> $GITHUB_ENV
echo "ANDROID_NDK_HOME=$ANDROID_NDK_HOME" >> $GITHUB_ENV
```

### 3. Cache des Dépendances

#### Cache Gradle
```yaml
- name: Cache des dépendances Gradle
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: |
      ${{ runner.os }}-gradle-
```

#### Cache npm
```yaml
- name: Cache des dépendances npm
  uses: actions/cache@v3
  with:
    path: |
      node_modules
      ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 4. Build des Applications

#### Build Debug
```bash
cd android
./gradlew assembleDebug --no-daemon
```

#### Build Release
```bash
cd android
./gradlew assembleRelease --no-daemon
```

### 5. Upload des Artefacts

```yaml
- name: Upload des artefacts Android
  uses: actions/upload-artifact@v3
  with:
    name: android-build-${{ matrix.build-type }}
    path: |
      android/app/build/outputs/apk/${{ matrix.build-type }}/*.apk
      android/app/build/outputs/bundle/${{ matrix.build-type }}/*.aab
    retention-days: 30
```

## Structure des Builds

### Types de Build

- **Debug** : Version de développement avec logs et debugging
- **Release** : Version de production optimisée

### Formats de Sortie

- **APK** : Fichier d'installation directe
- **AAB** : Android App Bundle (recommandé pour Google Play)

### Chemins de Sortie

```
android/app/build/outputs/
├── apk/
│   ├── debug/
│   │   └── app-debug.apk
│   └── release/
│       └── app-release.apk
└── bundle/
    ├── debug/
    │   └── app-debug.aab
    └── release/
        └── app-release.aab
```

## Optimisations

### Performance

- **Cache intelligent** : Réutilisation des dépendances entre builds
- **Build parallèle** : Matrix de build pour Debug et Release
- **Gradle daemon** : Désactivé pour éviter les conflits en CI

### Qualité

- **Validation TypeScript** : Vérification de la syntaxe avant build
- **Tests unitaires** : Exécution avant compilation
- **Analyse statique** : ESLint et Prettier

## Dépannage

### Problèmes Courants

#### Erreur Java
```bash
Error: Java version not found
```
**Solution** : Vérifier que Java 17 est installé et configuré

#### Erreur SDK Android
```bash
Error: Android SDK not found
```
**Solution** : Vérifier la configuration du SDK Android 34

#### Erreur Gradle
```bash
Error: Gradle build failed
```
**Solution** : Vérifier les permissions et la configuration Gradle

#### Erreur de Cache
```bash
Error: Cache restoration failed
```
**Solution** : Nettoyer le cache et relancer le build

### Logs de Debug

- **Gradle** : `./gradlew assembleDebug --info --stacktrace`
- **Android** : Vérifier les logs dans `android/app/build/outputs/logs/`
- **GitHub Actions** : Logs détaillés dans l'interface Actions

## Configuration Locale

### Prérequis

- **Java 17** : Installé et configuré
- **Android Studio** : Version récente avec SDK 34
- **Node.js 18** : Pour les dépendances React Native

### Variables d'Environnement

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Test Local

```bash
# Installation des dépendances
npm ci

# Build Android Debug
cd android
./gradlew assembleDebug

# Build Android Release
./gradlew assembleRelease
```

## Évolutions Futures

### Prochaine Version

- **Support iOS** : Intégration complète du build iOS
- **Tests E2E** : Tests d'intégration avec Appium ou Detox
- **Signing automatique** : Configuration des certificats de signature
- **Deployment automatique** : Upload vers Google Play Console

### Améliorations Techniques

- **Gradle Wrapper** : Mise à jour vers la dernière version stable
- **Build Variants** : Support des flavors (staging, production)
- **ProGuard** : Configuration de l'obfuscation pour la production
- **Multi-APK** : Support des architectures multiples (arm64, x86)

---

**Version du document** : 1.0  
**Dernière mise à jour** : Janvier 2025  
**Maintenu par** : Équipe DevOps EcoTri  
**Statut** : Android actif, iOS en développement
