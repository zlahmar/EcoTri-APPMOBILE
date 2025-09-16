// Désactivation des avertissements de dépréciation Firebase v22
(globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import { Platform, NativeModules } from 'react-native';

// Types pour ML Kit
export interface DetectedObject {
  id: string;
  boundingBox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  labels: Array<{
    text: string;
    confidence: number;
  }>;
  trackingId?: number;
}

export interface AdvancedDetectedObject {
  id: string;
  boundingBox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  labels: Array<{
    text: string;
    confidence: number;
    index: number;
  }>;
  confidence: number;
  area: number;
  center: {
    x: number;
    y: number;
  };
}

export interface SegmentedObject {
  boundingBox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  pixelCount: number;
  area: number;
  center: {
    x: number;
    y: number;
  };
}

export interface SegmentationResult {
  width: number;
  height: number;
  totalPixels: number;
  segmentationMask: string;
  objectZones: SegmentedObject[];
}

export interface DetectedPose {
  id: string;
  confidence: number;
  landmarks: number;
  isRecyclingAction: boolean;
}

export interface DetectedBarcode {
  rawValue: string;
  displayValue: string;
  format: string;
  boundingBox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface DetectedText {
  text: string;
  boundingBox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  confidence: number;
}

export interface DetectedFace {
  id: number;
  confidence: number;
  boundingBox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface ScanResult {
  objects: DetectedObject[];
  barcodes: DetectedBarcode[];
  text: DetectedText[];
  faces: DetectedFace[];
  advancedObjects?: AdvancedDetectedObject[];
  segmentedObjects?: SegmentedObject[];
  segmentationInfo?: {
    width: number;
    height: number;
    totalPixels: number;
    objectZones: number;
  };
  poses?: DetectedPose[];
  timestamp: number;
}

class MLKitService {
  private isInitialized = false;
  private useRealMLKit = true;
  private mlKitModule = NativeModules.MLKitModule;

  // Initialisation de ML Kit
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (Platform.OS !== 'android') {
        throw new Error("ML Kit n'est supporté que sur Android");
      }

      if (!this.mlKitModule) {
        throw new Error('Module ML Kit natif non disponible');
      }

      this.isInitialized = true;
      console.log(' ML Kit natif Android initialisé avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'initialisation de ML Kit natif:", error);
      throw error;
    }
  }

  // Détection d'objets avec ML Kit natif
  async detectObjects(imageUri: string): Promise<DetectedObject[]> {
    try {
      await this.initialize();

      if (this.useRealMLKit && this.mlKitModule) {
        console.log(" Détection d'objets avec ML Kit natif Android...");

        try {
          const result = await this.mlKitModule.detectObjectsAdvanced(imageUri);
          console.log(' Objets détectés par ML Kit natif AVANCÉ:', result);

          return result.map((obj: any, index: number) => ({
            id: obj.id || `obj_${index}`,
            boundingBox: obj.boundingBox || {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            },
            labels: obj.labels || [
              {
                text: obj.text || 'Objet détecté',
                confidence: obj.confidence || 0.8,
              },
            ],
          }));
        } catch (mlError) {
          console.warn(
            ' Erreur ML Kit natif avancé, fallback vers standard:',
            mlError,
          );

          const fallbackResult = await this.mlKitModule.detectObjects(imageUri);
          console.log(' Fallback vers détection standard:', fallbackResult);
          return fallbackResult.map((label: any, _index: number) => ({
            id: `obj_${_index}`,
            boundingBox: { left: 0, top: 0, right: 0, bottom: 0 },
            labels: [{ text: label.text, confidence: label.confidence }],
          }));
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error(" Erreur lors de la détection d'objets:", error);
      throw error;
    }
  }

  // Analyse d'une image pour détecter les codes-barres avec ML Kit natif
  async detectBarcodes(imageUri: string): Promise<DetectedBarcode[]> {
    try {
      await this.initialize();

      if (this.useRealMLKit && this.mlKitModule) {
        console.log(' Détection de codes-barres avec ML Kit natif Android...');

        try {
          const result = await this.mlKitModule.detectBarcodes(imageUri);

          console.log(' Codes-barres détectés par ML Kit natif:', result);

          return result.map((barcode: any, _index: number) => ({
            rawValue: barcode.rawValue,
            displayValue: barcode.displayValue,
            format: barcode.format,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            },
          }));
        } catch (mlError) {
          console.warn(' Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error(' Erreur lors de la détection de codes-barres:', error);
      throw error;
    }
  }

  // Analyse d'une image pour détecter le texte avec ML Kit natif
  async detectText(imageUri: string): Promise<DetectedText[]> {
    try {
      await this.initialize();

      if (this.useRealMLKit && this.mlKitModule) {
        console.log(' Détection de texte avec ML Kit natif Android...');

        try {
          const result = await this.mlKitModule.detectText(imageUri);

          console.log(' Texte détecté par ML Kit natif:', result);

          return result.map((textItem: any, _index: number) => ({
            text: textItem.text,
            confidence: textItem.confidence || 0.8,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            },
          }));
        } catch (mlError) {
          console.warn(' Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error(' Erreur lors de la détection de texte:', error);
      throw error;
    }
  }

  // Analyse d'une image pour détecter les visages avec ML Kit natif
  async detectFaces(imageUri: string): Promise<DetectedFace[]> {
    try {
      await this.initialize();

      if (this.useRealMLKit && this.mlKitModule) {
        console.log(' Détection de visages avec ML Kit natif Android...');

        try {
          const result = await this.mlKitModule.detectFaces(imageUri);

          console.log(' Visages détectés par ML Kit natif:', result);

          return result.map((face: any, _index: number) => ({
            id: face.id || _index,
            confidence: face.confidence || 0.9,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            },
          }));
        } catch (mlError) {
          console.warn(' Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error(' Erreur lors de la détection de visages:', error);
      throw error;
    }
  }

  // Analyse complète d'une image avec ML Kit natif
  async analyzeImage(imageUri: string): Promise<ScanResult> {
    try {
      console.log(" Début de l'analyse ML Kit natif Android...");

      if (this.useRealMLKit && this.mlKitModule) {
        const result = await this.mlKitModule.analyzeImage(imageUri);

        console.log(' Analyse ML Kit natif réussie:', result);

        return {
          objects: result.objects || [],
          barcodes: result.barcodes || [],
          text: result.text || [],
          faces: result.faces || [],
          advancedObjects: result.advancedObjects || [],
          segmentedObjects: result.segmentedObjects || [],
          segmentationInfo: result.segmentationInfo,
          poses: result.poses || [],
          timestamp: Date.now(),
        };
      } else {
        // Fallback vers l'analyse séquentielle
        const [objects, barcodes, text, faces] = await Promise.all([
          this.detectObjects(imageUri),
          this.detectBarcodes(imageUri),
          this.detectText(imageUri),
          this.detectFaces(imageUri),
        ]);

        const scanResult = {
          objects,
          barcodes,
          text,
          faces,
          timestamp: Date.now(),
        };

        console.log(
          ' Analyse ML Kit natif réussie (séquentielle):',
          scanResult,
        );
        return scanResult;
      }
    } catch (error) {
      console.error(" Erreur lors de l'analyse ML Kit natif:", error);
      throw error;
    }
  }

  // Méthode de détection d'objets avancée
  async detectObjectsAdvanced(
    imageUri: string,
  ): Promise<AdvancedDetectedObject[]> {
    try {
      await this.initialize();

      if (this.useRealMLKit && this.mlKitModule) {
        console.log(" Détection d'objets avancée avec ML Kit natif Android...");

        try {
          const result = await this.mlKitModule.detectObjectsAdvanced(imageUri);
          console.log(' Objets avancés détectés par ML Kit natif:', result);
          return result;
        } catch (mlError) {
          console.warn(' Erreur ML Kit natif avancé:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error(" Erreur lors de la détection d'objets avancés:", error);
      throw error;
    }
  }

  // Méthode de segmentation d'images
  async segmentImage(imageUri: string): Promise<SegmentationResult> {
    try {
      await this.initialize();

      if (this.useRealMLKit && this.mlKitModule) {
        console.log(" Segmentation d'image avec ML Kit natif Android...");

        try {
          const result = await this.mlKitModule.segmentImage(imageUri);
          console.log(' Image segmentée par ML Kit natif:', result);
          return result;
        } catch (mlError) {
          console.warn(' Erreur ML Kit natif segmentation:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error(" Erreur lors de la segmentation d'image:", error);
      throw error;
    }
  }

  // Simulation de détection d'objets
  private simulateObjectDetection(imageUri: string): DetectedObject[] {
    const simulatedObjects: DetectedObject[] = [];

    // Détection des objets basés sur l'URI (simulation)
    if (imageUri.includes('bottle') || imageUri.includes('plastic')) {
      simulatedObjects.push({
        id: 'obj_1',
        boundingBox: { left: 100, top: 100, right: 300, bottom: 400 },
        labels: [
          { text: 'Bouteille en plastique', confidence: 0.95 },
          { text: 'Recyclable', confidence: 0.88 },
        ],
      });
    }

    if (imageUri.includes('can') || imageUri.includes('metal')) {
      simulatedObjects.push({
        id: 'obj_2',
        boundingBox: { left: 350, top: 150, right: 450, bottom: 350 },
        labels: [
          { text: 'Canette métallique', confidence: 0.92 },
          { text: 'Recyclable', confidence: 0.85 },
        ],
      });
    }

    if (imageUri.includes('paper') || imageUri.includes('cardboard')) {
      simulatedObjects.push({
        id: 'obj_3',
        boundingBox: { left: 200, top: 200, right: 400, bottom: 300 },
        labels: [
          { text: 'Papier/Carton', confidence: 0.89 },
          { text: 'Recyclable', confidence: 0.91 },
        ],
      });
    }

    return simulatedObjects;
  }

  // Simulation de détection de codes-barres
  private simulateBarcodeDetection(imageUri: string): DetectedBarcode[] {
    const simulatedBarcodes: DetectedBarcode[] = [];

    if (imageUri.includes('barcode') || imageUri.includes('product')) {
      simulatedBarcodes.push({
        rawValue: '1234567890123',
        displayValue: '1234567890123',
        format: 'EAN_13',
        boundingBox: { left: 150, top: 250, right: 350, bottom: 280 },
      });
    }

    return simulatedBarcodes;
  }

  private simulateTextDetection(imageUri: string): DetectedText[] {
    const simulatedText: DetectedText[] = [];

    if (imageUri.includes('label') || imageUri.includes('text')) {
      simulatedText.push({
        text: 'Recyclable',
        boundingBox: { left: 120, top: 180, right: 200, bottom: 200 },
        confidence: 0.87,
      });

      simulatedText.push({
        text: 'PET 1',
        boundingBox: { left: 220, top: 180, right: 280, bottom: 200 },
        confidence: 0.92,
      });
    }

    return simulatedText;
  }

  private simulateFaceDetection(imageUri: string): DetectedFace[] {
    const simulatedFaces: DetectedFace[] = [];

    if (imageUri.includes('person') || imageUri.includes('face')) {
      simulatedFaces.push({
        id: 1,
        confidence: 0.9,
        boundingBox: { left: 100, top: 100, right: 300, bottom: 400 },
      });
    }

    return simulatedFaces;
  }

  // Classification d'un déchet basé sur les détections
  async classifyWaste(scanResult: ScanResult): Promise<{
    type:
      | 'plastic'
      | 'paper'
      | 'glass'
      | 'metal'
      | 'organic'
      | 'electronic'
      | 'unknown';
    confidence: number;
    recyclingInfo: string;
    environmentalImpact: string;
    icon: string;
    color: string;
    tips: string[];
  }> {
    try {
      console.log(' Début de la classification des déchets...');
      console.log(
        ' Structure du scanResult:',
        JSON.stringify(scanResult, null, 2),
      );

      const objects = scanResult.objects || [];
      const textDetected = scanResult.text || [];
      const barcodeData = scanResult.barcodes || [];

      console.log(' Objets détectés:', objects.length);
      console.log(' Texte détecté:', textDetected.length);
      console.log(' Codes-barres:', barcodeData.length);

      // Collecter les labels avec leur confiance
      const weightedLabels: Array<{text: string, confidence: number, source: string}> = [];
      
      objects.forEach((obj, index) => {
        if (obj && obj.labels && Array.isArray(obj.labels)) {
          obj.labels.forEach((label: any) => {
            if (label && label.text && label.confidence > 0.3) {
              weightedLabels.push({
                text: label.text.toLowerCase(),
                confidence: label.confidence,
                source: 'object'
              });
            }
          });
        } else if (obj && typeof obj === 'object') {
          const nativeObj = obj as any;
          if (nativeObj.text && nativeObj.confidence > 0.3) {
            weightedLabels.push({
              text: nativeObj.text.toLowerCase(),
              confidence: nativeObj.confidence,
              source: 'object'
            });
          }
        }
      });

      textDetected.forEach((textItem: any) => {
        if (textItem && textItem.text && textItem.confidence > 0.5) {
          weightedLabels.push({
            text: textItem.text.toLowerCase(),
            confidence: textItem.confidence,
            source: 'text'
          });
        }
      });

      // Analyser les codes-barres pour extraire des informations sur le matériau
      const barcodeAnalysis = this.analyzeBarcodes(barcodeData);
      if (barcodeAnalysis) {
        console.log(' 🏷️ Analyse du code-barres:', barcodeAnalysis);
        // Les codes-barres ont la priorité absolue
        const baseClassification = this.getClassificationByType(barcodeAnalysis.type);
        return {
          ...baseClassification,
          confidence: barcodeAnalysis.confidence,
          recyclingInfo: `🏷️ ${barcodeAnalysis.productInfo} - ${baseClassification.recyclingInfo}`,
          tips: [...baseClassification.tips, ...barcodeAnalysis.additionalTips]
        };
      }

      barcodeData.forEach((barcode: any) => {
        if (barcode && barcode.displayValue) {
          weightedLabels.push({
            text: barcode.displayValue.toLowerCase(),
            confidence: 0.9, // Les codes-barres sont très fiables
            source: 'barcode'
          });
        }
      });

      // Trier par confiance décroissante
      weightedLabels.sort((a, b) => b.confidence - a.confidence);

      console.log(' Labels pondérés:', weightedLabels);
      console.log(' Nombre total de labels:', weightedLabels.length);

      // Si pas de détections valides
      if (weightedLabels.length === 0) {
        console.log(' ❌ Aucun label détecté, retour classification inconnue');
        return this.getUnknownClassification();
      }

      // Logique spéciale : si on a très peu de détections, essayer de classifier par contexte
      if (weightedLabels.length <= 2) {
        // Vérifier les mots-clés électroniques
        const hasTechnicalKeywords = weightedLabels.some(label => 
          label.text.includes('keyboard') || label.text.includes('clavier') ||
          label.text.includes('computer') || label.text.includes('ordinateur') ||
          label.text.includes('laptop') || label.text.includes('portable') ||
          label.text.includes('mouse') || label.text.includes('souris') ||
          label.text.includes('trackpad') || label.text.includes('touchpad') ||
          label.text.includes('screen') || label.text.includes('écran') ||
          label.text.includes('device') || label.text.includes('appareil')
        );
        
        if (hasTechnicalKeywords) {
          console.log(' 🔧 Peu de détections mais mots-clés techniques trouvés, classification électronique');
          return this.getClassificationByType('electronic');
        }
        
        // Vérifier les mots-clés verre
        const hasGlassKeywords = weightedLabels.some(label => 
          label.text.includes('glass') || label.text.includes('verre') ||
          label.text.includes('bottle') || label.text.includes('bouteille') ||
          label.text.includes('wine') || label.text.includes('vin') ||
          label.text.includes('beer') || label.text.includes('bière') ||
          label.text.includes('jar') || label.text.includes('pot') ||
          label.text.includes('bocal') || label.text.includes('flacon')
        );
        
        if (hasGlassKeywords) {
          console.log(' 🍾 Peu de détections mais mots-clés verre trouvés, classification verre');
          return this.getClassificationByType('glass');
        }
        
        // Vérifier les mots-clés métal
        const hasMetalKeywords = weightedLabels.some(label => 
          label.text.includes('can') || label.text.includes('canette') ||
          label.text.includes('aluminum') || label.text.includes('aluminium') ||
          label.text.includes('steel') || label.text.includes('acier') ||
          label.text.includes('metal') || label.text.includes('métal')
        );
        
        if (hasMetalKeywords) {
          console.log(' 🥫 Peu de détections mais mots-clés métal trouvés, classification métal');
          return this.getClassificationByType('metal');
        }
      }

      // Vérifier d'abord les symboles de recyclage spécifiques
      const recyclingSymbolDetection = this.detectRecyclingSymbols(weightedLabels);
      if (recyclingSymbolDetection) {
        console.log(' Détection de symbole de recyclage:', recyclingSymbolDetection);
        const baseClassification = this.getClassificationByType(recyclingSymbolDetection.type);
        return {
          ...baseClassification,
          confidence: recyclingSymbolDetection.confidence,
          recyclingInfo: `♻️ ${recyclingSymbolDetection.symbol} - ${baseClassification.recyclingInfo}`
        };
      }

      // Sinon, utiliser la classification intelligente basée sur les mots-clés
      const classification = this.intelligentClassification(weightedLabels);
      
      console.log(' Classification finale:', classification);
      return classification;

    } catch (error) {
      console.error('Erreur lors de la classification du déchet:', error);
      throw error;
    }
  }

  // Analyse des codes-barres pour déterminer le type de matériau
  private analyzeBarcodes(barcodes: any[]): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    productInfo: string;
    additionalTips: string[];
  } | null {
    if (!barcodes || barcodes.length === 0) return null;

    for (const barcode of barcodes) {
      if (!barcode || !barcode.displayValue) continue;

      const code = barcode.displayValue;
      const format = barcode.format || '';

      console.log(` 🔍 Analyse du code-barres: ${code} (format: ${format})`);

      // Analyser les codes EAN-13 (13 chiffres)
      if (format === 'EAN_13' && code.length === 13) {
        const analysis = this.analyzeEAN13(code);
        if (analysis) return analysis;
      }

      // Analyser les codes EAN-8 (8 chiffres)
      if (format === 'EAN_8' && code.length === 8) {
        const analysis = this.analyzeEAN8(code);
        if (analysis) return analysis;
      }

      // Analyser les codes UPC (12 chiffres)
      if (format === 'UPC_A' && code.length === 12) {
        const analysis = this.analyzeUPC(code);
        if (analysis) return analysis;
      }

      // Analyser les codes QR (peuvent contenir des URLs ou des données JSON)
      if (format === 'QR_CODE') {
        const analysis = this.analyzeQRCode(code);
        if (analysis) return analysis;
      }
    }

    return null;
  }

  // Analyse des codes EAN-13
  private analyzeEAN13(code: string): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    productInfo: string;
    additionalTips: string[];
  } | null {
    const countryCode = code.substring(0, 3);
    const manufacturerCode = code.substring(3, 7);
    const productCode = code.substring(7, 12);
    const checkDigit = code.substring(12, 13);

    console.log(` 📊 EAN-13: Pays=${countryCode}, Fabricant=${manufacturerCode}, Produit=${productCode}`);

    // Base de données simplifiée de codes de pays et fabricants
    const countryData = {
      '300': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '301': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '302': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '303': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '304': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '305': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '306': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '307': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '308': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '309': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '310': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '311': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '312': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '313': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '314': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '315': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '316': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '317': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '318': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '319': { name: 'France', commonMaterials: ['glass', 'plastic', 'paper'] },
      '400': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '401': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '402': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '403': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '404': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '405': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '406': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '407': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '408': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '409': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '410': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '411': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '412': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '413': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '414': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '415': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '416': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '417': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '418': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '419': { name: 'Allemagne', commonMaterials: ['glass', 'plastic', 'paper'] },
      '500': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '501': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '502': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '503': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '504': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '505': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '506': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '507': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '508': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '509': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '510': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '511': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '512': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '513': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '514': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '515': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '516': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '517': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '518': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] },
      '519': { name: 'Royaume-Uni', commonMaterials: ['glass', 'plastic', 'paper'] }
    };

    const country = countryData[countryCode as keyof typeof countryData];
    if (!country) return null;

    // Analyser le code produit pour déterminer le type de matériau
    const productAnalysis = this.analyzeProductCode(productCode, countryCode);
    if (productAnalysis) {
      return {
        type: productAnalysis.type,
        confidence: 0.95, // Très haute confiance pour les codes-barres
        productInfo: `Produit ${country.name} (${productAnalysis.category})`,
        additionalTips: productAnalysis.tips
      };
    }

    return null;
  }

  // Analyse des codes EAN-8
  private analyzeEAN8(code: string): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    productInfo: string;
    additionalTips: string[];
  } | null {
    // EAN-8 est plus simple, on analyse juste les premiers chiffres
    const productCode = code.substring(0, 4);
    const analysis = this.analyzeProductCode(productCode, '300'); // France par défaut
    if (analysis) {
      return {
        type: analysis.type,
        confidence: 0.9,
        productInfo: `Produit français (${analysis.category})`,
        additionalTips: analysis.tips
      };
    }
    return null;
  }

  // Analyse des codes UPC
  private analyzeUPC(code: string): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    productInfo: string;
    additionalTips: string[];
  } | null {
    const productCode = code.substring(1, 6); // Ignorer le premier chiffre (système)
    const analysis = this.analyzeProductCode(productCode, '000'); // US par défaut
    if (analysis) {
      return {
        type: analysis.type,
        confidence: 0.9,
        productInfo: `Produit américain (${analysis.category})`,
        additionalTips: analysis.tips
      };
    }
    return null;
  }

  // Analyse des codes QR
  private analyzeQRCode(code: string): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    productInfo: string;
    additionalTips: string[];
  } | null {
    // Vérifier si c'est une URL
    if (code.startsWith('http')) {
      return {
        type: 'unknown',
        confidence: 0.7,
        productInfo: 'QR Code avec URL',
        additionalTips: ['Scannez l\'URL pour plus d\'informations']
      };
    }

    // Vérifier si c'est du JSON
    try {
      const data = JSON.parse(code);
      if (data.material || data.type) {
        const material = data.material || data.type;
        const type = this.mapMaterialToType(material);
        if (type !== 'unknown') {
          return {
            type,
            confidence: 0.95,
            productInfo: `QR Code: ${data.name || 'Produit'}`,
            additionalTips: data.tips || []
          };
        }
      }
    } catch (e) {
      // Pas du JSON, ignorer
    }

    return null;
  }

  // Analyse du code produit pour déterminer le type de matériau
  private analyzeProductCode(productCode: string, countryCode: string): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    category: string;
    tips: string[];
  } | null {
    // Base de données simplifiée de codes produits
    const productCodes = {
      // Codes de boissons (souvent verre ou plastique)
      '1000': { type: 'glass', category: 'Boisson alcoolisée', tips: ['Rincez avant recyclage'] },
      '1001': { type: 'glass', category: 'Vin', tips: ['Retirez le bouchon', 'Rincez bien'] },
      '1002': { type: 'glass', category: 'Bière', tips: ['Retirez le bouchon', 'Rincez bien'] },
      '1003': { type: 'plastic', category: 'Boisson gazeuse', tips: ['Rincez le contenant', 'Retirez l\'étiquette'] },
      '1004': { type: 'plastic', category: 'Eau', tips: ['Rincez le contenant', 'Aplatissez la bouteille'] },
      '1005': { type: 'glass', category: 'Spiritueux', tips: ['Retirez le bouchon', 'Rincez bien'] },
      
      // Codes de conserves (métal)
      '2000': { type: 'metal', category: 'Conserve alimentaire', tips: ['Rincez bien', 'Retirez l\'étiquette'] },
      '2001': { type: 'metal', category: 'Boisson en canette', tips: ['Rincez bien', 'Aplatissez la canette'] },
      '2002': { type: 'metal', category: 'Aérosol', tips: ['Videz complètement', 'Retirez le bouchon'] },
      
      // Codes de produits laitiers (souvent plastique)
      '3000': { type: 'plastic', category: 'Produit laitier', tips: ['Rincez le pot', 'Retirez l\'étiquette'] },
      '3001': { type: 'plastic', category: 'Yaourt', tips: ['Rincez le pot', 'Retirez l\'étiquette'] },
      '3002': { type: 'plastic', category: 'Fromage', tips: ['Rincez l\'emballage', 'Retirez l\'étiquette'] },
      
      // Codes de produits de nettoyage (souvent plastique)
      '4000': { type: 'plastic', category: 'Produit de nettoyage', tips: ['Videz complètement', 'Rincez le contenant'] },
      '4001': { type: 'plastic', category: 'Détergent', tips: ['Videz complètement', 'Rincez le contenant'] },
      '4002': { type: 'plastic', category: 'Shampoing', tips: ['Videz complètement', 'Rincez le contenant'] },
      
      // Codes de produits cosmétiques (souvent verre ou plastique)
      '5000': { type: 'glass', category: 'Parfum', tips: ['Retirez le bouchon', 'Rincez bien'] },
      '5001': { type: 'plastic', category: 'Crème', tips: ['Videz complètement', 'Rincez le pot'] },
      '5002': { type: 'glass', category: 'Produit de beauté', tips: ['Retirez le bouchon', 'Rincez bien'] },
      
      // Codes de produits électroniques
      '6000': { type: 'electronic', category: 'Batterie', tips: ['Apportez en déchetterie', 'Ne jetez pas à la poubelle'] },
      '6001': { type: 'electronic', category: 'Téléphone', tips: ['Apportez en déchetterie', 'Effacez les données'] },
      '6002': { type: 'electronic', category: 'Ordinateur', tips: ['Apportez en déchetterie', 'Effacez les données'] }
    };

    const product = productCodes[productCode as keyof typeof productCodes];
    if (product) {
      return product;
    }

    // Analyse basée sur les patterns de codes
    const firstDigit = productCode.charAt(0);
    switch (firstDigit) {
      case '1': return { type: 'glass', category: 'Boisson', tips: ['Rincez avant recyclage'] };
      case '2': return { type: 'metal', category: 'Conserve', tips: ['Rincez bien', 'Retirez l\'étiquette'] };
      case '3': return { type: 'plastic', category: 'Produit laitier', tips: ['Rincez le contenant'] };
      case '4': return { type: 'plastic', category: 'Produit de nettoyage', tips: ['Videz complètement'] };
      case '5': return { type: 'glass', category: 'Cosmétique', tips: ['Retirez le bouchon'] };
      case '6': return { type: 'electronic', category: 'Électronique', tips: ['Apportez en déchetterie'] };
      default: return null;
    }
  }

  // Mapper les matériaux aux types de classification
  private mapMaterialToType(material: string): 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown' {
    const materialMap: {[key: string]: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown'} = {
      'plastic': 'plastic',
      'plastique': 'plastic',
      'verre': 'glass',
      'glass': 'glass',
      'metal': 'metal',
      'métal': 'metal',
      'aluminium': 'metal',
      'acier': 'metal',
      'papier': 'paper',
      'paper': 'paper',
      'carton': 'paper',
      'cardboard': 'paper',
      'organique': 'organic',
      'organic': 'organic',
      'électronique': 'electronic',
      'electronic': 'electronic',
      'batterie': 'electronic',
      'battery': 'electronic'
    };

    return materialMap[material.toLowerCase()] || 'unknown';
  }

  // Détection spécifique des symboles de recyclage et codes de matériaux
  private detectRecyclingSymbols(weightedLabels: Array<{text: string, confidence: number, source: string}>): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    symbol: string;
  } | null {
    // Codes de recyclage plastique (1-7)
    const plasticCodes = ['1', '2', '3', '4', '5', '6', '7', 'pet', 'hdpe', 'pvc', 'ldpe', 'pp', 'ps', 'other'];
    // Symboles de recyclage
    const recyclingSymbols = ['♻', 'recyclable', 'recyclage', 'recycle', 'tri', 'tri selectif'];
    // Codes de matériaux
    const materialCodes = {
      'alu': 'metal',
      'aluminium': 'metal',
      'steel': 'metal',
      'acier': 'metal',
      'fe': 'metal',
      'glass': 'glass',
      'verre': 'glass',
      'paper': 'paper',
      'papier': 'paper',
      'cardboard': 'paper',
      'carton': 'paper'
    };

    for (const label of weightedLabels) {
      const text = label.text.toLowerCase();
      
      // Vérifier les codes de recyclage plastique
      for (const code of plasticCodes) {
        if (text.includes(code)) {
          return {
            type: 'plastic',
            confidence: Math.min(label.confidence + 0.2, 0.95),
            symbol: `Code ${code.toUpperCase()}`
          };
        }
      }
      
      // Vérifier les symboles de recyclage génériques
      for (const symbol of recyclingSymbols) {
        if (text.includes(symbol)) {
          // Essayer de déterminer le type basé sur le contexte
          if (text.includes('bouteille') || text.includes('bottle')) {
            // Vérifier si c'est du verre ou du plastique
            if (text.includes('verre') || text.includes('glass') || 
                text.includes('wine') || text.includes('beer') || 
                text.includes('vin') || text.includes('bière')) {
              return {
                type: 'glass',
                confidence: Math.min(label.confidence + 0.2, 0.95),
                symbol: '♻️ Bouteille en verre'
              };
            } else {
              return {
                type: 'plastic',
                confidence: Math.min(label.confidence + 0.15, 0.9),
                symbol: '♻️ Bouteille en plastique'
              };
            }
          }
          if (text.includes('canette') || text.includes('can')) {
            return {
              type: 'metal',
              confidence: Math.min(label.confidence + 0.15, 0.9),
              symbol: '♻️ Canette'
            };
          }
        }
      }
      
      // Vérifier les codes de matériaux spécifiques
      for (const [code, type] of Object.entries(materialCodes)) {
        if (text.includes(code)) {
          return {
            type: type as any,
            confidence: Math.min(label.confidence + 0.2, 0.95),
            symbol: `Code ${code.toUpperCase()}`
          };
        }
      }
    }
    
    return null;
  }

  // Classification intelligente basée sur la confiance et les mots-clés
  private intelligentClassification(weightedLabels: Array<{text: string, confidence: number, source: string}>): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    recyclingInfo: string;
    environmentalImpact: string;
    icon: string;
    color: string;
    tips: string[];
  } {
    // Définir les mots-clés avec leur poids et type de matériau
    const materialKeywords = {
      plastic: {
        keywords: [
          'bottle', 'bouteille', 'flacon', 'plastic', 'pet', 'hdpe', 'pp', 'ps', 'pvc', 'ldpe',
          'container', 'beverage', 'drink', 'soda', 'water', 'juice', 'milk', 'yogurt',
          'wrapper', 'bag', 'sachet', 'film', 'packaging', 'recyclable'
        ],
        weight: 1.0,
        type: 'plastic' as const
      },
      metal: {
        keywords: [
          'can', 'canette', 'aluminum', 'aluminium', 'steel', 'acier', 'tin', 'metal',
          'beverage', 'soda', 'beer', 'food', 'tin can', 'aerosol', 'dose'
        ],
        weight: 1.0,
        type: 'metal' as const
      },
      glass: {
        keywords: [
          'glass', 'verre', 'jar', 'pot', 'bocal', 'flacon', 'vase', 'crystal',
          'wine', 'beer', 'spirit', 'perfume', 'cosmetic', 'preserve', 'marmalade',
          'glass bottle', 'bouteille en verre', 'verre transparent', 'verre coloré',
          'bouteille de vin', 'bouteille de bière', 'bocal en verre', 'flacon en verre'
        ],
        weight: 1.2, // Poids plus élevé pour le verre
        type: 'glass' as const
      },
      paper: {
        keywords: [
          'paper', 'papier', 'cardboard', 'carton', 'box', 'boîte', 'caisse', 'envelope',
          'magazine', 'newspaper', 'journal', 'book', 'notebook', 'tissue', 'napkin'
        ],
        weight: 1.0,
        type: 'paper' as const
      },
      electronic: {
        keywords: [
          'battery', 'batterie', 'phone', 'téléphone', 'computer', 'ordinateur', 'screen',
          'écran', 'electronic', 'électronique', 'device', 'appareil', 'cable', 'câble',
          'keyboard', 'clavier', 'mouse', 'souris', 'laptop', 'portable', 'notebook',
          'tablet', 'tablette', 'monitor', 'moniteur', 'speaker', 'haut-parleur',
          'headphone', 'casque', 'charger', 'chargeur', 'usb', 'bluetooth', 'wifi',
          'keyboard', 'clavier', 'trackpad', 'touchpad', 'webcam', 'camera', 'caméra'
        ],
        weight: 1.3, // Poids plus élevé pour les objets électroniques
        type: 'electronic' as const
      },
      organic: {
        keywords: [
          'food', 'aliment', 'fruit', 'légume', 'vegetable', 'meat', 'viande', 'fish',
          'poisson', 'bread', 'pain', 'organic', 'organique', 'compost', 'waste', 'déchet'
        ],
        weight: 1.0,
        type: 'organic' as const
      }
    };

    // Calculer les scores pour chaque type de matériau
    const scores: {[key: string]: {score: number, confidence: number, matches: string[]}} = {};
    
    Object.entries(materialKeywords).forEach(([material, config]) => {
      scores[material] = { score: 0, confidence: 0, matches: [] };
      
      weightedLabels.forEach(label => {
        config.keywords.forEach(keyword => {
          if (label.text.includes(keyword)) {
            let matchScore = config.weight * label.confidence;
            
            // Bonus pour les mots-clés spécifiques au verre
            if (material === 'glass' && (keyword.includes('verre') || keyword.includes('glass'))) {
              matchScore *= 1.5; // Bonus de 50% pour les mots-clés spécifiques au verre
            }
            
            // Pénalité si "bottle" est détecté mais pas de contexte verre
            if (material === 'plastic' && keyword === 'bottle' && !label.text.includes('verre') && !label.text.includes('glass')) {
              matchScore *= 0.7; // Réduction de 30% pour éviter la confusion
            }
            
            // Pénalité sévère pour le plastique si on détecte des objets électroniques
            if (material === 'plastic' && (
              label.text.includes('keyboard') || label.text.includes('clavier') ||
              label.text.includes('computer') || label.text.includes('ordinateur') ||
              label.text.includes('laptop') || label.text.includes('portable') ||
              label.text.includes('mouse') || label.text.includes('souris') ||
              label.text.includes('trackpad') || label.text.includes('touchpad')
            )) {
              matchScore *= 0.1; // Réduction de 90% pour éviter la confusion plastique/électronique
            }
            
            scores[material].score += matchScore;
            scores[material].matches.push(`${keyword} (${(label.confidence * 100).toFixed(0)}%)`);
          }
        });
      });
      
      // Calculer la confiance moyenne des matches
      if (scores[material].matches.length > 0) {
        const matchingLabels = weightedLabels.filter(label => 
          config.keywords.some(keyword => label.text.includes(keyword))
        );
        scores[material].confidence = matchingLabels.reduce((sum, label) => sum + label.confidence, 0) / matchingLabels.length;
      }
    });

    console.log(' Scores de classification:', scores);

    // Logique spéciale pour détecter les bouteilles en verre
    const hasBottleKeyword = weightedLabels.some(label => 
      label.text.includes('bottle') || label.text.includes('bouteille')
    );
    const hasGlassKeyword = weightedLabels.some(label => 
      label.text.includes('glass') || label.text.includes('verre')
    );
    const hasWineBeerContext = weightedLabels.some(label => 
      label.text.includes('wine') || label.text.includes('beer') || 
      label.text.includes('vin') || label.text.includes('bière')
    );

    // Si on détecte "bottle" mais aussi du contexte verre, favoriser le verre
    if (hasBottleKeyword && (hasGlassKeyword || hasWineBeerContext)) {
      scores.glass.score *= 2.0; // Double le score du verre
      console.log(' 🍾 Contexte verre détecté, bonus appliqué au verre');
    }

    // Logique spéciale pour détecter les objets électroniques
    const hasElectronicKeywords = weightedLabels.some(label => 
      label.text.includes('keyboard') || label.text.includes('clavier') ||
      label.text.includes('computer') || label.text.includes('ordinateur') ||
      label.text.includes('laptop') || label.text.includes('portable') ||
      label.text.includes('mouse') || label.text.includes('souris') ||
      label.text.includes('trackpad') || label.text.includes('touchpad')
    );

    // Si on détecte des mots-clés électroniques, favoriser l'électronique
    if (hasElectronicKeywords) {
      scores.electronic.score *= 2.5; // Triple le score de l'électronique
      console.log(' 💻 Contexte électronique détecté, bonus appliqué à l\'électronique');
    }

    // Trouver le meilleur match
    let bestMatch = 'unknown';
    let bestScore = 0;
    let bestConfidence = 0;

    Object.entries(scores).forEach(([material, data]) => {
      if (data.score > bestScore || (data.score === bestScore && data.confidence > bestConfidence)) {
        bestScore = data.score;
        bestConfidence = data.confidence;
        bestMatch = material;
      }
    });

    console.log(` Meilleur match: ${bestMatch} (score: ${bestScore.toFixed(2)}, confiance: ${(bestConfidence * 100).toFixed(0)}%)`);

    // Si le score est très faible, essayer une classification par défaut basée sur le contexte
    if (bestScore < 0.3) {
      console.log(' ⚠️ Score très faible, tentative de classification par défaut');
      
      // Vérifier s'il y a des indices d'objets électroniques dans le texte détecté
      const hasElectronicHints = weightedLabels.some(label => 
        label.text.includes('keyboard') || label.text.includes('clavier') ||
        label.text.includes('computer') || label.text.includes('ordinateur') ||
        label.text.includes('laptop') || label.text.includes('portable') ||
        label.text.includes('mouse') || label.text.includes('souris') ||
        label.text.includes('trackpad') || label.text.includes('touchpad') ||
        label.text.includes('screen') || label.text.includes('écran') ||
        label.text.includes('device') || label.text.includes('appareil') ||
        label.text.includes('asus') || label.text.includes('vivobook') ||
        label.text.includes('laptop') || label.text.includes('notebook')
      );
      
      if (hasElectronicHints) {
        console.log(' 🔧 Indices électroniques trouvés, classification électronique par défaut');
        return this.getClassificationByType('electronic');
      }
      
      // Vérifier s'il y a des indices de verre dans le texte détecté
      const hasGlassHints = weightedLabels.some(label => 
        label.text.includes('glass') || label.text.includes('verre') ||
        label.text.includes('bottle') || label.text.includes('bouteille') ||
        label.text.includes('wine') || label.text.includes('vin') ||
        label.text.includes('beer') || label.text.includes('bière') ||
        label.text.includes('jar') || label.text.includes('pot') ||
        label.text.includes('bocal') || label.text.includes('flacon') ||
        label.text.includes('crystal') || label.text.includes('cristal') ||
        label.text.includes('perfume') || label.text.includes('parfum') ||
        label.text.includes('spirit') || label.text.includes('spiritueux')
      );
      
      if (hasGlassHints) {
        console.log(' 🍾 Indices verre trouvés, classification verre par défaut');
        return this.getClassificationByType('glass');
      }
      
      // Vérifier s'il y a des indices de métal dans le texte détecté
      const hasMetalHints = weightedLabels.some(label => 
        label.text.includes('can') || label.text.includes('canette') ||
        label.text.includes('aluminum') || label.text.includes('aluminium') ||
        label.text.includes('steel') || label.text.includes('acier') ||
        label.text.includes('tin') || label.text.includes('fer') ||
        label.text.includes('metal') || label.text.includes('métal') ||
        label.text.includes('aerosol') || label.text.includes('aérosol') ||
        label.text.includes('dose') || label.text.includes('boîte')
      );
      
      if (hasMetalHints) {
        console.log(' 🥫 Indices métal trouvés, classification métal par défaut');
        return this.getClassificationByType('metal');
      }
      
      // Vérifier s'il y a des indices de papier dans le texte détecté
      const hasPaperHints = weightedLabels.some(label => 
        label.text.includes('paper') || label.text.includes('papier') ||
        label.text.includes('cardboard') || label.text.includes('carton') ||
        label.text.includes('box') || label.text.includes('boîte') ||
        label.text.includes('envelope') || label.text.includes('enveloppe') ||
        label.text.includes('magazine') || label.text.includes('magazine') ||
        label.text.includes('newspaper') || label.text.includes('journal') ||
        label.text.includes('book') || label.text.includes('livre') ||
        label.text.includes('notebook') || label.text.includes('carnet')
      );
      
      if (hasPaperHints) {
        console.log(' 📦 Indices papier trouvés, classification papier par défaut');
        return this.getClassificationByType('paper');
      }
      
      // Si pas d'indices clairs, retourner inconnu
      console.log(' ❓ Aucun indice clair, classification inconnue');
      return this.getUnknownClassification();
    }

    // Retourner la classification appropriée
    switch (bestMatch) {
      case 'plastic':
        return {
          type: 'plastic',
          confidence: Math.min(bestConfidence + 0.1, 0.95),
          recyclingInfo: '♻️ Recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.5kg de CO2 par kg recyclé',
          icon: '🥤',
          color: '#FFD700',
          tips: [
            'Rincez le contenant avant de le jeter',
            'Retirez les bouchons et étiquettes',
            "Aplatissez pour économiser l'espace",
            'Vérifiez le symbole de recyclage',
          ],
        };
      case 'metal':
        return {
          type: 'metal',
          confidence: Math.min(bestConfidence + 0.1, 0.95),
          recyclingInfo: '♻️ Recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.8kg de CO2 par kg recyclé',
          icon: '🥫',
          color: '#C0C0C0',
          tips: [
            'Rincez bien les conserves',
            'Aplatissez les canettes',
            'Retirez les étiquettes',
            "Séparez l'aluminium de l'acier",
          ],
        };
      case 'glass':
        return {
          type: 'glass',
          confidence: Math.min(bestConfidence + 0.1, 0.95),
          recyclingInfo: '♻️ Recyclable dans le bac vert',
          environmentalImpact: '🌱 Économise 0.3kg de CO2 par kg recyclé',
          icon: '🍾',
          color: '#50C878',
          tips: [
            'Rincez bien le contenant',
            'Retirez les bouchons métalliques',
            'Ne cassez pas le verre',
            'Séparez par couleur si possible',
          ],
        };
      case 'paper':
        return {
          type: 'paper',
          confidence: Math.min(bestConfidence + 0.1, 0.95),
          recyclingInfo: '♻️ Recyclable dans le bac bleu',
          environmentalImpact: '🌱 Économise 1.8kg de CO2 par kg recyclé',
          icon: '📦',
          color: '#4A90E2',
          tips: [
            'Retirez le film plastique',
            'Aplatissez les cartons',
            'Évitez le papier gras ou souillé',
            'Séparez le carton du papier',
          ],
        };
      case 'electronic':
        return {
          type: 'electronic',
          confidence: Math.min(bestConfidence + 0.1, 0.95),
          recyclingInfo: '⚠️ Déposez en déchetterie ou point de collecte',
          environmentalImpact: '🌱 Évite la pollution des sols et eaux',
          icon: '📱',
          color: '#FF6B6B',
          tips: [
            'Ne jetez jamais à la poubelle',
            'Déposez en déchetterie',
            'Utilisez les points de collecte',
            'Retirez les batteries si possible',
          ],
        };
      case 'organic':
        return {
          type: 'organic',
          confidence: Math.min(bestConfidence + 0.1, 0.95),
          recyclingInfo: '♻️ Compostable ou bac marron',
          environmentalImpact: '🌱 Économise 0.5kg de CO2 par kg composté',
          icon: '🍃',
          color: '#8B4513',
          tips: [
            'Évitez les produits gras',
            'Coupez en petits morceaux',
            'Mélangez avec des matières sèches',
            'Aérez régulièrement le compost',
          ],
        };
      default:
        return this.getUnknownClassification();
    }
  }

  // Obtenir la classification de base par type de matériau
  private getClassificationByType(type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown') {
    switch (type) {
      case 'plastic':
        return {
          type: 'plastic' as const,
          confidence: 0.9,
          recyclingInfo: '♻️ Recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.5kg de CO2 par kg recyclé',
          icon: '🥤',
          color: '#FFD700',
          tips: [
            'Rincez le contenant avant de le jeter',
            'Retirez les bouchons et étiquettes',
            "Aplatissez pour économiser l'espace",
            'Vérifiez le symbole de recyclage',
          ],
        };
      case 'metal':
        return {
          type: 'metal' as const,
          confidence: 0.9,
          recyclingInfo: '♻️ Recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.8kg de CO2 par kg recyclé',
          icon: '🥫',
          color: '#C0C0C0',
          tips: [
            'Rincez bien les conserves',
            'Aplatissez les canettes',
            'Retirez les étiquettes',
            "Séparez l'aluminium de l'acier",
          ],
        };
      case 'glass':
        return {
          type: 'glass' as const,
          confidence: 0.9,
          recyclingInfo: '♻️ Recyclable dans le bac vert',
          environmentalImpact: '🌱 Économise 0.3kg de CO2 par kg recyclé',
          icon: '🍾',
          color: '#50C878',
          tips: [
            'Rincez bien le contenant',
            'Retirez les bouchons métalliques',
            'Ne cassez pas le verre',
            'Séparez par couleur si possible',
          ],
        };
      case 'paper':
        return {
          type: 'paper' as const,
          confidence: 0.9,
          recyclingInfo: '♻️ Recyclable dans le bac bleu',
          environmentalImpact: '🌱 Économise 1.8kg de CO2 par kg recyclé',
          icon: '📦',
          color: '#4A90E2',
          tips: [
            'Retirez le film plastique',
            'Aplatissez les cartons',
            'Évitez le papier gras ou souillé',
            'Séparez le carton du papier',
          ],
        };
      case 'electronic':
        return {
          type: 'electronic' as const,
          confidence: 0.9,
          recyclingInfo: '⚠️ Déposez en déchetterie ou point de collecte',
          environmentalImpact: '🌱 Évite la pollution des sols et eaux',
          icon: '📱',
          color: '#FF6B6B',
          tips: [
            'Ne jetez jamais à la poubelle',
            'Déposez en déchetterie',
            'Utilisez les points de collecte',
            'Retirez les batteries si possible',
          ],
        };
      case 'organic':
        return {
          type: 'organic' as const,
          confidence: 0.9,
          recyclingInfo: '♻️ Compostable ou bac marron',
          environmentalImpact: '🌱 Économise 0.5kg de CO2 par kg composté',
          icon: '🍃',
          color: '#8B4513',
          tips: [
            'Évitez les produits gras',
            'Coupez en petits morceaux',
            'Mélangez avec des matières sèches',
            'Aérez régulièrement le compost',
          ],
        };
      default:
        return this.getUnknownClassification();
    }
  }

  // Classification par défaut pour les cas inconnus
  private getUnknownClassification() {
    return {
      type: 'unknown' as const,
      confidence: 0.3,
      recyclingInfo: '❓ Type non identifié, consultez les consignes locales',
      environmentalImpact: '🌱 Impact environnemental non calculé',
      icon: '❓',
      color: '#9E9E9E',
      tips: [
        'Essayez de prendre une photo plus claire',
        "Vérifiez les symboles sur l'emballage",
        'Consultez les consignes de votre commune',
        "Utilisez l'application de votre collectivité",
      ],
    };
  }
}

export default new MLKitService();
