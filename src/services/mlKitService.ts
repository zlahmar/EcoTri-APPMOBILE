// Désactiver les avertissements de dépréciation Firebase v22
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
  timestamp: number;
}

class MLKitService {
  private isInitialized = false;
  private useRealMLKit = true; // 🚀 VRAI ML Kit natif Android ACTIVÉ !
  private mlKitModule = NativeModules.MLKitModule;

  // Initialiser ML Kit
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Vérifier que la plateforme est Android
      if (Platform.OS !== 'android') {
        throw new Error('ML Kit n\'est supporté que sur Android');
      }
      
      // Vérifier que le module natif est disponible
      if (!this.mlKitModule) {
        throw new Error('Module ML Kit natif non disponible');
      }
      
      // ✅ ML Kit natif Android activé !
      this.isInitialized = true;
      console.log('🚀 ML Kit natif Android initialisé avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de ML Kit natif:', error);
      throw error;
    }
  }

  // Analyser une image pour détecter les objets avec ML Kit natif
  async detectObjects(imageUri: string): Promise<DetectedObject[]> {
    try {
      await this.initialize();
      
      if (this.useRealMLKit && this.mlKitModule) {
        console.log('🔍 Détection d\'objets avec ML Kit natif Android...');
        
        try {
          // Utiliser le module natif ML Kit Android
          const result = await this.mlKitModule.detectObjects(imageUri);
          
          console.log('✅ Objets détectés par ML Kit natif:', result);
          
          return result.map((label: any, _index: number) => ({
            id: `obj_${_index}`,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            },
            labels: [{
              text: label.text,
              confidence: label.confidence
            }]
          }));
        } catch (mlError) {
          console.warn('⚠️ Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la détection d\'objets:', error);
      throw error;
    }
  }

  // Analyser une image pour détecter les codes-barres avec ML Kit natif
  async detectBarcodes(imageUri: string): Promise<DetectedBarcode[]> {
    try {
      await this.initialize();
      
      if (this.useRealMLKit && this.mlKitModule) {
        console.log('📱 Détection de codes-barres avec ML Kit natif Android...');
        
        try {
          // Utiliser le module natif ML Kit Android
          const result = await this.mlKitModule.detectBarcodes(imageUri);
          
          console.log('✅ Codes-barres détectés par ML Kit natif:', result);
          
          return result.map((barcode: any, _index: number) => ({
            rawValue: barcode.rawValue,
            displayValue: barcode.displayValue,
            format: barcode.format,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }
          }));
        } catch (mlError) {
          console.warn('⚠️ Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la détection de codes-barres:', error);
      throw error;
    }
  }

  // Analyser une image pour détecter le texte avec ML Kit natif
  async detectText(imageUri: string): Promise<DetectedText[]> {
    try {
      await this.initialize();
      
      if (this.useRealMLKit && this.mlKitModule) {
        console.log('📝 Détection de texte avec ML Kit natif Android...');
        
        try {
          // Utiliser le module natif ML Kit Android
          const result = await this.mlKitModule.detectText(imageUri);
          
          console.log('✅ Texte détecté par ML Kit natif:', result);
          
          return result.map((textItem: any, _index: number) => ({
            text: textItem.text,
            confidence: textItem.confidence || 0.8,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }
          }));
        } catch (mlError) {
          console.warn('⚠️ Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la détection de texte:', error);
      throw error;
    }
  }

  // Analyser une image pour détecter les visages avec ML Kit natif
  async detectFaces(imageUri: string): Promise<DetectedFace[]> {
    try {
      await this.initialize();
      
      if (this.useRealMLKit && this.mlKitModule) {
        console.log('👤 Détection de visages avec ML Kit natif Android...');
        
        try {
          // Utiliser le module natif ML Kit Android
          const result = await this.mlKitModule.detectFaces(imageUri);
          
          console.log('✅ Visages détectés par ML Kit natif:', result);
          
          return result.map((face: any, _index: number) => ({
            id: face.id || _index,
            confidence: face.confidence || 0.9,
            boundingBox: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }
          }));
        } catch (mlError) {
          console.warn('⚠️ Erreur ML Kit natif:', mlError);
          throw mlError;
        }
      } else {
        throw new Error('ML Kit natif non activé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la détection de visages:', error);
      throw error;
    }
  }

  // Analyser complète d'une image avec ML Kit natif
  async analyzeImage(imageUri: string): Promise<ScanResult> {
    try {
      console.log('🚀 Début de l\'analyse ML Kit natif Android...');
      
      if (this.useRealMLKit && this.mlKitModule) {
        // Utiliser la méthode d'analyse complète du module natif
        const result = await this.mlKitModule.analyzeImage(imageUri);
        
        console.log('✅ Analyse ML Kit natif réussie:', result);
        
        return {
          objects: result.objects || [],
          barcodes: result.barcodes || [],
          text: result.text || [],
          faces: result.faces || [],
          timestamp: Date.now()
        };
      } else {
        // Fallback vers l'analyse séquentielle
        const [objects, barcodes, text, faces] = await Promise.all([
          this.detectObjects(imageUri),
          this.detectBarcodes(imageUri),
          this.detectText(imageUri),
          this.detectFaces(imageUri)
        ]);

        const scanResult = {
          objects,
          barcodes,
          text,
          faces,
          timestamp: Date.now()
        };

        console.log('✅ Analyse ML Kit natif réussie (séquentielle):', scanResult);
        return scanResult;
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse ML Kit natif:', error);
      throw error;
    }
  }

  // Simulation de détection d'objets (à remplacer par ML Kit)
  private simulateObjectDetection(imageUri: string): DetectedObject[] {
    // Simulation basée sur des patterns d'image
    const simulatedObjects: DetectedObject[] = [];
    
    // Détecter des objets basés sur l'URI (simulation)
    if (imageUri.includes('bottle') || imageUri.includes('plastic')) {
      simulatedObjects.push({
        id: 'obj_1',
        boundingBox: { left: 100, top: 100, right: 300, bottom: 400 },
        labels: [
          { text: 'Bouteille en plastique', confidence: 0.95 },
          { text: 'Recyclable', confidence: 0.88 }
        ]
      });
    }
    
    if (imageUri.includes('can') || imageUri.includes('metal')) {
      simulatedObjects.push({
        id: 'obj_2',
        boundingBox: { left: 350, top: 150, right: 450, bottom: 350 },
        labels: [
          { text: 'Canette métallique', confidence: 0.92 },
          { text: 'Recyclable', confidence: 0.85 }
        ]
      });
    }
    
    if (imageUri.includes('paper') || imageUri.includes('cardboard')) {
      simulatedObjects.push({
        id: 'obj_3',
        boundingBox: { left: 200, top: 200, right: 400, bottom: 300 },
        labels: [
          { text: 'Papier/Carton', confidence: 0.89 },
          { text: 'Recyclable', confidence: 0.91 }
        ]
      });
    }

    return simulatedObjects;
  }

  // Simulation de détection de codes-barres
  private simulateBarcodeDetection(imageUri: string): DetectedBarcode[] {
    const simulatedBarcodes: DetectedBarcode[] = [];
    
    // Simuler la détection d'un code-barres
    if (imageUri.includes('barcode') || imageUri.includes('product')) {
      simulatedBarcodes.push({
        rawValue: '1234567890123',
        displayValue: '1234567890123',
        format: 'EAN_13',
        boundingBox: { left: 150, top: 250, right: 350, bottom: 280 }
      });
    }

    return simulatedBarcodes;
  }

  // Simulation de détection de texte
  private simulateTextDetection(imageUri: string): DetectedText[] {
    const simulatedText: DetectedText[] = [];
    
    // Simuler la détection de texte sur l'emballage
    if (imageUri.includes('label') || imageUri.includes('text')) {
      simulatedText.push({
        text: 'Recyclable',
        boundingBox: { left: 120, top: 180, right: 200, bottom: 200 },
        confidence: 0.87
      });
      
      simulatedText.push({
        text: 'PET 1',
        boundingBox: { left: 220, top: 180, right: 280, bottom: 200 },
        confidence: 0.92
      });
    }

    return simulatedText;
  }

  // Simulation de détection de visages
  private simulateFaceDetection(imageUri: string): DetectedFace[] {
    const simulatedFaces: DetectedFace[] = [];
    
    // Simuler la détection de visages
    if (imageUri.includes('person') || imageUri.includes('face')) {
      simulatedFaces.push({
        id: 1,
        confidence: 0.9,
        boundingBox: { left: 100, top: 100, right: 300, bottom: 400 }
      });
    }

    return simulatedFaces;
  }

  // Classifier un déchet basé sur les détections
  async classifyWaste(scanResult: ScanResult): Promise<{
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    recyclingInfo: string;
    environmentalImpact: string;
    icon: string;
    color: string;
    tips: string[];
  }> {
    try {
      console.log('🔍 Début de la classification des déchets...');
      console.log('📊 Structure du scanResult:', JSON.stringify(scanResult, null, 2));
      
      // Vérification de sécurité pour éviter les erreurs undefined
      const objects = scanResult.objects || [];
      const textDetected = scanResult.text || [];
      const barcodeData = scanResult.barcodes || [];
      
      console.log('🎯 Objets détectés:', objects.length);
      console.log('📝 Texte détecté:', textDetected.length);
      console.log('📱 Codes-barres:', barcodeData.length);
      
      // Extraction sécurisée des labels d'objets
      const objectLabels: string[] = [];
      objects.forEach((obj, index) => {
        if (obj && obj.labels && Array.isArray(obj.labels)) {
          obj.labels.forEach((label: any) => {
            if (label && label.text) {
              objectLabels.push(label.text.toLowerCase());
            }
          });
        } else if (obj && typeof obj === 'object') {
          // Fallback pour la structure native ML Kit
          console.log(`🔧 Objet ${index} (structure native):`, obj);
          // Vérification flexible pour la structure native
          const nativeObj = obj as any;
          if (nativeObj.text) {
            objectLabels.push(nativeObj.text.toLowerCase());
          }
        }
      });
      
      // Extraction sécurisée du texte détecté
      const textLabels: string[] = [];
      textDetected.forEach((textItem: any) => {
        if (textItem && textItem.text) {
          textLabels.push(textItem.text.toLowerCase());
        }
      });
      
      // Extraction sécurisée des codes-barres
      const barcodeLabels: string[] = [];
      barcodeData.forEach((barcode: any) => {
        if (barcode && barcode.displayValue) {
          barcodeLabels.push(barcode.displayValue.toLowerCase());
        }
      });
      
      // Combinaison de tous les textes détectés
      const allText = [
        ...objectLabels,
        ...textLabels,
        ...barcodeLabels
      ].join(' ');
      
      console.log('🔤 Texte combiné pour classification:', allText);
      
      // Classification PLASTIQUE
      if (allText.includes('plastique') || allText.includes('bouteille') || 
          allText.includes('pet') || allText.includes('hdpe') || allText.includes('pp') ||
          allText.includes('ps') || allText.includes('pvc') || allText.includes('ldpe') ||
          allText.includes('bouteille') || allText.includes('flacon') || allText.includes('emballage') ||
          allText.includes('plastic') || allText.includes('bottle') || allText.includes('container')) {
        console.log('🥤 Classification: PLASTIQUE');
        return {
          type: 'plastic',
          confidence: 0.92,
          recyclingInfo: '♻️ Recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.5kg de CO2 par kg recyclé',
          icon: '🥤',
          color: '#FFD700',
          tips: [
            'Rincez le contenant avant de le jeter',
            'Retirez les bouchons et étiquettes',
            'Aplatissez pour économiser l\'espace',
            'Vérifiez le symbole de recyclage'
          ]
        };
      }
      
      // Classification PAPIER/CARTON
      if (allText.includes('papier') || allText.includes('carton') || 
          allText.includes('journal') || allText.includes('magazine') ||
          allText.includes('emballage') || allText.includes('boîte') ||
          allText.includes('caisse') || allText.includes('enveloppe') ||
          allText.includes('paper') || allText.includes('cardboard') || allText.includes('box')) {
        console.log('📦 Classification: PAPIER/CARTON');
        return {
          type: 'paper',
          confidence: 0.89,
          recyclingInfo: '♻️ Recyclable dans le bac bleu',
          environmentalImpact: '🌱 Économise 1.8kg de CO2 par kg recyclé',
          icon: '📦',
          color: '#4A90E2',
          tips: [
            'Retirez le film plastique',
            'Aplatissez les cartons',
            'Évitez le papier gras ou souillé',
            'Séparez le carton du papier'
          ]
        };
      }
      
      // Classification VERRE
      if (allText.includes('verre') || allText.includes('bouteille') || 
          allText.includes('pot') || allText.includes('conserve') ||
          allText.includes('bocal') || allText.includes('flacon') ||
          allText.includes('glass') || allText.includes('jar') || allText.includes('bottle')) {
        console.log('🍾 Classification: VERRE');
        return {
          type: 'glass',
          confidence: 0.91,
          recyclingInfo: '♻️ Recyclable dans le bac vert',
          environmentalImpact: '🌱 Économise 0.3kg de CO2 par kg recyclé',
          icon: '🍾',
          color: '#50C878',
          tips: [
            'Rincez bien le contenant',
            'Retirez les bouchons métalliques',
            'Ne cassez pas le verre',
            'Séparez par couleur si possible'
          ]
        };
      }
      
      // Classification MÉTAL
      if (allText.includes('métal') || allText.includes('canette') || 
          allText.includes('aluminium') || allText.includes('fer') ||
          allText.includes('acier') || allText.includes('boîte') ||
          allText.includes('conserve') || allText.includes('dose') ||
          allText.includes('metal') || allText.includes('can') || allText.includes('aluminum') ||
          allText.includes('steel') || allText.includes('tin')) {
        console.log('🥫 Classification: MÉTAL');
        return {
          type: 'metal',
          confidence: 0.94,
          recyclingInfo: '♻️ Recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.8kg de CO2 par kg recyclé',
          icon: '🥫',
          color: '#C0C0C0',
          tips: [
            'Rincez bien les conserves',
            'Aplatissez les canettes',
            'Retirez les étiquettes',
            'Séparez l\'aluminium de l\'acier'
          ]
        };
      }

      // Classification ÉLECTRONIQUE
      if (allText.includes('électronique') || allText.includes('batterie') || 
          allText.includes('pile') || allText.includes('téléphone') ||
          allText.includes('ordinateur') || allText.includes('écran')) {
        return {
          type: 'electronic',
          confidence: 0.87,
          recyclingInfo: '⚠️ Déposez en déchetterie ou point de collecte',
          environmentalImpact: '🌱 Évite la pollution des sols et eaux',
          icon: '📱',
          color: '#FF6B6B',
          tips: [
            'Ne jetez jamais à la poubelle',
            'Déposez en déchetterie',
            'Utilisez les points de collecte',
            'Retirez les batteries si possible'
          ]
        };
      }

      // Classification ORGANIQUE
      if (allText.includes('organique') || allText.includes('compost') || 
          allText.includes('déchet') || allText.includes('alimentaire') ||
          allText.includes('restes') || allText.includes('épluchures')) {
        return {
          type: 'organic',
          confidence: 0.85,
          recyclingInfo: '♻️ Compostable ou bac marron',
          environmentalImpact: '🌱 Économise 0.5kg de CO2 par kg composté',
          icon: '🍃',
          color: '#8B4513',
          tips: [
            'Évitez les produits gras',
            'Coupez en petits morceaux',
            'Mélangez avec des matières sèches',
            'Aérez régulièrement le compost'
          ]
        };
      }
      
      // Si on a des détections mais pas de classification claire, essayons de deviner
      if (scanResult.objects.length > 0 || scanResult.text.length > 0) {
        const bestGuess = this.makeEducatedGuess(allText);
        return {
          type: bestGuess.type,
          confidence: bestGuess.confidence,
          recyclingInfo: bestGuess.recyclingInfo,
          environmentalImpact: bestGuess.environmentalImpact,
          icon: bestGuess.icon,
          color: bestGuess.color,
          tips: bestGuess.tips
        };
      }
      
      // Par défaut - aucune détection
      return {
        type: 'unknown',
        confidence: 0.3,
        recyclingInfo: '❓ Type non identifié, consultez les consignes locales',
        environmentalImpact: '🌱 Impact environnemental non calculé',
        icon: '❓',
        color: '#9E9E9E',
        tips: [
          'Essayez de prendre une photo plus claire',
          'Vérifiez les symboles sur l\'emballage',
          'Consultez les consignes de votre commune',
          'Utilisez l\'application de votre collectivité'
        ]
      };
    } catch (error) {
      console.error('Erreur lors de la classification du déchet:', error);
      throw error;
    }
  }

  // Faire une supposition éduquée basée sur le contexte
  private makeEducatedGuess(text: string): {
    type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'unknown';
    confidence: number;
    recyclingInfo: string;
    environmentalImpact: string;
    icon: string;
    color: string;
    tips: string[];
  } {
    // Mots-clés pour chaque type
    const keywords = {
      plastic: ['bouteille', 'flacon', 'emballage', 'sachet', 'film', 'sac'],
      paper: ['emballage', 'boîte', 'caisse', 'enveloppe', 'papier'],
      glass: ['bouteille', 'pot', 'bocal', 'flacon'],
      metal: ['canette', 'boîte', 'conserve', 'dose'],
      organic: ['déchet', 'alimentaire', 'restes', 'épluchures'],
      electronic: ['batterie', 'pile', 'téléphone', 'ordinateur']
    };

    let bestMatch = 'unknown';
    let bestScore = 0;

    Object.entries(keywords).forEach(([type, words]) => {
      const score = words.filter(word => text.includes(word)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = type;
      }
    });

    // Retourner la classification basée sur la meilleure correspondance
    switch (bestMatch) {
      case 'plastic':
        return {
          type: 'plastic',
          confidence: 0.7,
          recyclingInfo: '♻️ Probablement recyclable dans le bac jaune',
          environmentalImpact: '🌱 Économise 2.5kg de CO2 par kg recyclé',
          icon: '🥤',
          color: '#FFD700',
          tips: ['Vérifiez le symbole de recyclage', 'Rincez avant de jeter']
        };
      case 'paper':
        return {
          type: 'paper',
          confidence: 0.7,
          recyclingInfo: '♻️ Probablement recyclable dans le bac bleu',
          environmentalImpact: '🌱 Économise 1.8kg de CO2 par kg recyclé',
          icon: '📦',
          color: '#4A90E2',
          tips: ['Retirez le film plastique', 'Aplatissez les cartons']
        };
      default:
        return {
          type: 'unknown',
          confidence: 0.4,
          recyclingInfo: '❓ Type probable, vérifiez les consignes',
          environmentalImpact: '🌱 Impact environnemental variable',
          icon: '❓',
          color: '#9E9E9E',
          tips: ['Consultez les consignes locales', 'Vérifiez les symboles']
        };
    }
  }
}

export default new MLKitService();
