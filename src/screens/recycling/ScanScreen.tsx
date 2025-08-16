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
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import Header from '../../components/common/Header';
import mlKitService, { ScanResult } from '../../services/mlKitService';
import statsService from '../../services/localStatsService';

const ScanScreen = ({ 
  isAuthenticated = false, 
  onProfilePress, 
  userInfo: _userInfo 
}: { 
  isAuthenticated?: boolean; 
  onProfilePress?: () => void; 
  userInfo?: any; 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [wasteClassification, setWasteClassification] = useState<any>(null);

  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  // Demande des permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
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

        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission Stockage',
            message: 'L\'application a besoin d\'accéder à votre galerie pour sélectionner des images',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );

        if (cameraPermission === PermissionsAndroid.RESULTS.GRANTED && 
            storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(' Permissions accordées');
        } else {
          console.log(' Permissions refusées');
        }
      } catch (err) {
        console.warn('Erreur lors de la demande de permissions:', err);
      }
    }
  };

  // Prise d'une photo avec la caméra
  const takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8 as const,
        includeBase64: false,
      });

      if (result.assets && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
        setScanResult(null);
        setWasteClassification(null);
        setPointsEarned(null);
        setMotivationalMessage(null);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre une photo');
    }
  };

  // Sélection d'une image depuis la galerie
  const selectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8 as const,
        includeBase64: false,
      });

      if (result.assets && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
        setScanResult(null);
        setWasteClassification(null);
        setPointsEarned(null);
        setMotivationalMessage(null);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  // Analyse d'une image avec ML Kit
  const analyzeImage = async (imageUri: string) => {
    setIsScanning(true);
    try {
      const result = await mlKitService.analyzeImage(imageUri);
      setScanResult(result);
      console.log('Analyse ML Kit réussie:', result);
      
      try {
        const classification = await mlKitService.classifyWaste(result);
        setWasteClassification(classification);
        console.log(' Classification automatique réussie:', classification);

        //  Ajout des statistiques et points (si connecté)
        if (classification && classification.type) {
          try {
            const confidence = classification.confidence || 0.5;
            const statsResult = await statsService.addScan(
              classification.type,
              confidence
            );
            
            if (statsResult) {
              setPointsEarned(statsResult.pointsEarned);
              setMotivationalMessage(statsResult.message);
              console.log(' Points gagnés:', statsResult.pointsEarned);
            } else {
              setPointsEarned(0);
              setMotivationalMessage(' Connectez-vous pour enregistrer vos statistiques et gagner des points !');
              console.log(' Utilisateur non connecté - Stats non enregistrées');
              setPointsEarned(0);
              setMotivationalMessage(' Connectez-vous pour enregistrer vos statistiques et gagner des points !');
            }
          } catch (statsError) {
            console.warn(' Erreur lors de l\'ajout des statistiques:', statsError);
            setPointsEarned(0);
            setMotivationalMessage(' Erreur lors de l\'enregistrement des statistiques');
          }
        }
      } catch (classificationError) {
        console.warn(' Erreur lors de la classification automatique:', classificationError);
        setWasteClassification(null);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      Alert.alert('Erreur', 'Impossible d\'analyser l\'image');
    } finally {
      setIsScanning(false);
    }
  };

  // Réinitialisation du scan
  const resetScan = () => {
    setScanResult(null);
    setSelectedImage(null);
    setWasteClassification(null);
  };

  const renderScanResults = () => {
    if (!scanResult) return null;

    const objects = scanResult.objects || [];
    const barcodes = scanResult.barcodes || [];
    const text = scanResult.text || [];
    const faces = scanResult.faces || [];

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          <MaterialIcons name="search" size={20} color={colors.primary} style={styles.resultIcon} />
          Résultats de l'analyse ML Kit
        </Text>
        
        {objects.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>
              <MaterialIcons name="target" size={18} color={colors.primary} style={styles.resultIcon} />
              Objets détectés:
            </Text>
            {objects.map((obj, index) => (
              <View key={obj?.id || `obj_${index}`} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>
                    {obj?.labels?.[0]?.text || 'Objet non identifié'}
                  </Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(obj?.labels?.[0]?.confidence || 0) }]}>
                    <Text style={styles.confidenceText}>
                      {Math.round((obj?.labels?.[0]?.confidence || 0) * 100)}%
                    </Text>
                  </View>
                </View>
                {obj?.labels && obj.labels.length > 1 && (
                  <Text style={styles.resultSubtext}>
                    Autres détections: {obj.labels.slice(1).map(l => l?.text || 'N/A').join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {barcodes.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>
              <MaterialIcons name="bar-chart" size={18} color={colors.primary} style={styles.resultIcon} />
              Codes-barres:
            </Text>
            {barcodes.map((barcode, index) => (
              <View key={barcode?.rawValue || `barcode_${index}`} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>{barcode?.displayValue || 'Code non lisible'}</Text>
                  <View style={styles.formatBadge}>
                    <Text style={styles.formatText}>{barcode?.format || 'Inconnu'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {text.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>
              <MaterialIcons name="file-text" size={18} color={colors.primary} style={styles.resultIcon} />
              Texte détecté:
            </Text>
            {text.map((textItem, index) => (
              <View key={textItem?.text || `text_${index}`} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>{textItem?.text || 'Texte non lisible'}</Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(textItem?.confidence || 0) }]}>
                    <Text style={styles.confidenceText}>
                      {Math.round((textItem?.confidence || 0) * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {faces.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>
              <MaterialIcons name="face" size={18} color={colors.primary} style={styles.resultIcon} />
              Visages détectés:
            </Text>
            {faces.map((face, index) => (
              <View key={face?.id || `face_${index}`} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>Visage #{face?.id || index + 1}</Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(face?.confidence || 0) }]}>
                    <Text style={styles.confidenceText}>
                      {Math.round((face?.confidence || 0) * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>
            <MaterialIcons name="info" size={18} color={colors.warning} style={styles.resultIcon} />
            Debug - Structure des données:
          </Text>
          <Text style={styles.debugText}>
            Objets: {JSON.stringify(objects.length)} | 
            Codes: {JSON.stringify(barcodes.length)} | 
            Texte: {JSON.stringify(text.length)} | 
            Visages: {JSON.stringify(faces.length)}
          </Text>
          <Text style={styles.debugText}>
            Timestamp: {scanResult.timestamp ? new Date(scanResult.timestamp).toLocaleTimeString() : 'N/A'}
          </Text>
        </View>

        {wasteClassification && (
          <View style={styles.classificationSection}>
            <Text style={styles.classificationTitle}>
              <MaterialIcons name="auto-awesome" size={20} color={colors.primary} style={styles.resultIcon} />
              Classification Automatique du Déchet
            </Text>
            
            <View style={[styles.classificationCard, { borderColor: wasteClassification.color }]}>
              <View style={styles.classificationHeader}>
                <Text style={[styles.classificationType, { color: wasteClassification.color }]}>
                  {wasteClassification.type.toUpperCase()}
                </Text>
                <View style={[styles.confidenceBadge, { backgroundColor: wasteClassification.color }]}>
                  <Text style={styles.confidenceText}>
                    {Math.round(wasteClassification.confidence * 100)}%
                  </Text>
                </View>
              </View>
              
              <Text style={styles.recyclingInfo}>{wasteClassification.recyclingInfo}</Text>
              <Text style={styles.environmentalImpact}>{wasteClassification.environmentalImpact}</Text>
              
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>
                  <MaterialIcons name="lightbulb" size={16} color={colors.warning} style={styles.resultIcon} />
                  Conseils pratiques :
                </Text>
                {wasteClassification.tips.map((tip: string, index: number) => (
                  <Text key={index} style={styles.tipText}>• {tip}</Text>
                ))}
              </View>
            </View>

            {pointsEarned !== null && (
              <View style={styles.pointsSection}>
                {pointsEarned > 0 ? (
                  <View style={styles.pointsCard}>
                    <MaterialIcons name="stars" size={24} color={colors.warning} style={styles.pointsIcon} />
                    <Text style={styles.pointsText}>
                      +{pointsEarned} points gagnés !
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.pointsCard, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
                    <MaterialIcons name="info" size={24} color={colors.primary} style={styles.pointsIcon} />
                    <Text style={[styles.pointsText, { color: colors.primary }]}>
                      Connectez-vous pour gagner des points !
                    </Text>
                  </View>
                )}
                
                {motivationalMessage && (
                  <Text style={styles.motivationalText}>
                    {motivationalMessage}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.resetButton} onPress={resetScan}>
            <MaterialIcons name="refresh" size={20} color={colors.textInverse} style={styles.resetButtonIcon} />
            <Text style={styles.resetButtonText}>Nouveau scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FF9800';
    return '#F44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Scanner Éco" 
        showProfileIcon={true}
        isAuthenticated={isAuthenticated} 
        onProfilePress={onProfilePress}
      />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        overScrollMode="always"
      >
        {!selectedImage ? (
          <>
            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <MaterialIcons name="smartphone" size={60} color={colors.primary} style={styles.scanIcon} />
                <Text style={styles.scanText}>Scanner un déchet</Text>
                <Text style={styles.scanSubtext}>
                  Pointez votre caméra vers le code-barres ou l'objet
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.scanButton} onPress={takePhoto}>
                <MaterialIcons name="camera-alt" size={24} color={colors.textInverse} style={styles.buttonIcon} />
                <Text style={styles.scanButtonText}>Prendre une photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.galleryButton} onPress={selectImage}>
                <MaterialIcons name="photo-library" size={24} color={colors.primary} style={styles.buttonIcon} />
                <Text style={styles.galleryButtonText}>Choisir une image</Text>
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
          <Text style={styles.infoTitle}>Instructions de Scan</Text>
          <Text style={styles.instructionsText}>
            1. Appuyez sur le bouton caméra{'\n'}
            2. Prenez une photo de votre déchet{'\n'}
            3. Notre IA analysera et classera automatiquement{'\n'}
            4. Suivez les instructions de recyclage
          </Text>
          
          <View style={styles.authInfo}>
            <MaterialIcons name="info" size={16} color={colors.textLight} style={styles.authIcon} />
            <Text style={styles.authText}>
              <MaterialIcons name="lightbulb" size={14} color={colors.primary} style={styles.resultIcon} />
              Connectez-vous pour enregistrer vos statistiques et gagner des points !
            </Text>
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
  scrollContent: {
    paddingBottom: 120,
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
  resetButtonIcon: {
    marginBottom: 8,
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
  instructionsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'left',
    lineHeight: 22,
    paddingHorizontal: 10,
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
  debugSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  classificationSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  classificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  classificationCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  classificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classificationType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recyclingInfo: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  environmentalImpact: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 15,
  },
  tipsContainer: {
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  pointsSection: {
    marginTop: 15,
    alignItems: 'center',
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.warning,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pointsIcon: {
    marginRight: 10,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warning,
  },
  motivationalText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  authInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  authIcon: {
    marginRight: 8,
  },
  authText: {
    fontSize: 13,
    color: colors.textLight,
    flex: 1,
  },
  resultIcon: {
    marginRight: 8,
  },
});

export default ScanScreen;
