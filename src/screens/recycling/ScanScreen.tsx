import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  Image,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { colors } from '../../styles';
import Header from '../../components/common/Header';
import mlKitService, { ScanResult } from '../../services/mlKitService';

const ScanScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasStoragePermission, setHasStoragePermission] = useState(false);

  // Demander les permissions au démarrage
  useEffect(() => {
    requestPermissions();
  }, []);

  // Demander les permissions nécessaires
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Permission caméra
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permission Caméra',
            message: 'L\'application a besoin d\'accéder à votre caméra pour scanner les déchets',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );
        setHasCameraPermission(cameraPermission === PermissionsAndroid.RESULTS.GRANTED);

        // Permission stockage (pour Android < 13)
        if (Platform.Version < 33) {
          const storagePermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permission Stockage',
              message: 'L\'application a besoin d\'accéder à votre stockage pour sélectionner des images',
              buttonNeutral: 'Demander plus tard',
              buttonNegative: 'Annuler',
              buttonPositive: 'OK',
            }
          );
          setHasStoragePermission(storagePermission === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          // Android 13+ utilise READ_MEDIA_IMAGES qui est automatiquement accordé
          setHasStoragePermission(true);
        }
      } catch (err) {
        console.warn('Erreur lors de la demande de permissions:', err);
      }
    } else {
      // Sur iOS, les permissions sont gérées automatiquement
      setHasCameraPermission(true);
      setHasStoragePermission(true);
    }
  };

  // Options pour le sélecteur d'images
  const imagePickerOptions = {
    mediaType: 'photo' as const,
    quality: 0.8 as const,
    includeBase64: false,
    maxWidth: 1024,
    maxHeight: 1024,
  };

  // Lancer la caméra
  const handleCameraLaunch = async () => {
    if (!hasCameraPermission) {
      Alert.alert(
        'Permission requise',
        'L\'accès à la caméra est nécessaire pour prendre des photos. Veuillez accorder la permission dans les paramètres.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Paramètres', onPress: () => requestPermissions() }
        ]
      );
      return;
    }

    launchCamera(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('Utilisateur a annulé la prise de photo');
      } else if (response.errorCode) {
        console.error('Erreur caméra:', response.errorMessage);
        Alert.alert('Erreur', `Impossible d'accéder à la caméra: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setSelectedImage(imageUri);
          analyzeImage(imageUri);
        }
      }
    });
  };

  // Lancer la galerie
  const handleGalleryLaunch = async () => {
    if (!hasStoragePermission) {
      Alert.alert(
        'Permission requise',
        'L\'accès au stockage est nécessaire pour sélectionner des images. Veuillez accorder la permission dans les paramètres.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Paramètres', onPress: () => requestPermissions() }
        ]
      );
      return;
    }

    launchImageLibrary(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('Utilisateur a annulé la sélection');
      } else if (response.errorCode) {
        console.error('Erreur galerie:', response.errorMessage);
        Alert.alert('Erreur', `Impossible d'accéder à la galerie: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setSelectedImage(imageUri);
          analyzeImage(imageUri);
        }
      }
    });
  };

  // Analyser l'image avec ML Kit
  const analyzeImage = async (imageUri: string) => {
    setIsScanning(true);
    try {
      const result = await mlKitService.analyzeImage(imageUri);
      setScanResult(result);
      console.log('Analyse ML Kit réussie:', result);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      Alert.alert('Erreur', 'Impossible d\'analyser l\'image');
    } finally {
      setIsScanning(false);
    }
  };

  // Classifier le déchet
  const classifyWaste = async () => {
    if (!scanResult) return;
    
    try {
      const classification = await mlKitService.classifyWaste(scanResult);
      
      // Afficher une alerte plus détaillée
      Alert.alert(
        `${classification.icon} Déchet identifié: ${classification.type.toUpperCase()}`,
        `${classification.recyclingInfo}\n\n${classification.environmentalImpact}`,
        [
          { text: 'Voir les conseils', onPress: () => showDetailedResults(classification) },
          { text: 'Nouveau scan', onPress: () => resetScan() }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la classification:', error);
      Alert.alert('Erreur', 'Impossible de classifier le déchet');
    }
  };

  // Afficher les résultats détaillés
  const showDetailedResults = (classification: any) => {
    Alert.alert(
      `${classification.icon} Conseils de recyclage`,
      `Type: ${classification.type.toUpperCase()}\nConfiance: ${Math.round(classification.confidence * 100)}%\n\n${classification.recyclingInfo}\n\n${classification.environmentalImpact}`,
      [
        { text: 'Conseils pratiques', onPress: () => showTips(classification) },
        { text: 'Fermer', style: 'cancel' }
      ]
    );
  };

  // Afficher les conseils pratiques
  const showTips = (classification: any) => {
    const tipsText = classification.tips.map((tip: string, index: number) => `${index + 1}. ${tip}`).join('\n');
    Alert.alert(
      '💡 Conseils pratiques',
      tipsText,
      [
        { text: 'OK', style: 'default' },
        { text: 'Nouveau scan', onPress: () => resetScan() }
      ]
    );
  };

  // Réinitialiser le scan
  const resetScan = () => {
    setScanResult(null);
    setSelectedImage(null);
  };

  // Afficher les résultats du scan avec une interface améliorée
  const renderScanResults = () => {
    if (!scanResult) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>🔍 Résultats de l'analyse</Text>
        
        {scanResult.objects.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>🎯 Objets détectés:</Text>
            {scanResult.objects.map((obj) => (
              <View key={obj.id} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>
                    {obj.labels[0]?.text || 'Objet non identifié'}
                  </Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(obj.labels[0]?.confidence || 0) }]}>
                    <Text style={styles.confidenceText}>
                      {Math.round((obj.labels[0]?.confidence || 0) * 100)}%
                    </Text>
                  </View>
                </View>
                {obj.labels.length > 1 && (
                  <Text style={styles.resultSubtext}>
                    Autres détections: {obj.labels.slice(1).map(l => l.text).join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {scanResult.barcodes.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>📊 Codes-barres:</Text>
            {scanResult.barcodes.map((barcode) => (
              <View key={barcode.rawValue} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>{barcode.displayValue}</Text>
                  <View style={styles.formatBadge}>
                    <Text style={styles.formatText}>{barcode.format}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {scanResult.text.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>📝 Texte détecté:</Text>
            {scanResult.text.map((text) => (
              <View key={text.text} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>{text.text}</Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(text.confidence) }]}>
                    <Text style={styles.confidenceText}>
                      {Math.round(text.confidence * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.classifyButton} onPress={classifyWaste}>
            <Text style={styles.classifyButtonText}>🔍 Classifier le déchet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetScan}>
            <Text style={styles.resetButtonText}>🔄 Nouveau scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Obtenir la couleur de confiance
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#4CAF50'; // Vert
    if (confidence >= 0.6) return '#FF9800'; // Orange
    return '#F44336'; // Rouge
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Scanner de Déchets" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedImage ? (
          <>
            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <Text style={styles.scanIcon}>📱</Text>
                <Text style={styles.scanText}>Scanner un déchet</Text>
                <Text style={styles.scanSubtext}>
                  Pointez votre caméra vers le code-barres ou l'objet
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.scanButton} onPress={handleCameraLaunch}>
                <Text style={styles.scanButtonText}>📷 Prendre une photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryLaunch}>
                <Text style={styles.galleryButtonText}>🖼️ Choisir une image</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            {isScanning && (
              <View style={styles.scanningOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.scanningText}>Analyse en cours...</Text>
              </View>
            )}
          </View>
        )}

        {renderScanResults()}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Comment ça marche ?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>1️⃣</Text>
            <Text style={styles.infoText}>Prenez une photo ou sélectionnez une image</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>2️⃣</Text>
            <Text style={styles.infoText}>L'IA identifie automatiquement le type</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>3️⃣</Text>
            <Text style={styles.infoText}>Recevez des conseils de recyclage</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scanArea: {
    alignItems: 'center',
    marginVertical: 30,
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scanIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  scanText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  scanSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    minHeight: 55,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  galleryButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  galleryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 15,
    backgroundColor: colors.surface,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: colors.textInverse,
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: 15,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  resultItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  confidenceBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textInverse,
    textAlign: 'center',
  },
  resultSubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  formatBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  formatText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textInverse,
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  classifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    minHeight: 50,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  classifyButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    minHeight: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
});

export default ScanScreen;
