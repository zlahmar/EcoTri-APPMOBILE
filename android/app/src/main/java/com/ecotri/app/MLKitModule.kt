package com.ecotri.app

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.label.ImageLabeling
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import java.io.File
import java.io.FileInputStream
import java.io.IOException

class MLKitModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        private const val TAG = "MLKitModule"
        private const val MODULE_NAME = "MLKitModule"
    }

    override fun getName(): String = MODULE_NAME

    // Méthode pour détecter les objets dans une image
    @ReactMethod
    fun detectObjects(imageUri: String, promise: Promise) {
        try {
            Log.d(TAG, "🔍 Début de la détection d'objets pour: $imageUri")
            
            val image = loadImageFromUri(imageUri)
            val inputImage = InputImage.fromBitmap(image, 0)
            
            val options = ImageLabelerOptions.Builder()
                .setConfidenceThreshold(0.7f)
                .build()
            
            val labeler = ImageLabeling.getClient(options)
            
            labeler.process(inputImage)
                .addOnSuccessListener { labels ->
                    Log.d(TAG, "✅ Objets détectés: ${labels.size}")
                    
                    val resultArray = Arguments.createArray()
                    labels.forEach { label ->
                        val labelObject = Arguments.createMap().apply {
                            putString("text", label.text)
                            putDouble("confidence", label.confidence.toDouble())
                            putString("index", label.index.toString())
                        }
                        resultArray.pushMap(labelObject)
                    }
                    
                    promise.resolve(resultArray)
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection d'objets", exception)
                    promise.reject("DETECTION_ERROR", "Erreur lors de la détection d'objets", exception)
                }
                
        } catch (exception: Exception) {
            Log.e(TAG, "❌ Erreur lors de la détection d'objets", exception)
            promise.reject("DETECTION_ERROR", "Erreur lors de la détection d'objets", exception)
        }
    }

    // Méthode pour détecter les codes-barres dans une image
    @ReactMethod
    fun detectBarcodes(imageUri: String, promise: Promise) {
        try {
            Log.d(TAG, "📱 Début de la détection de codes-barres pour: $imageUri")
            
            val image = loadImageFromUri(imageUri)
            val inputImage = InputImage.fromBitmap(image, 0)
            
            val scanner = BarcodeScanning.getClient()
            
            scanner.process(inputImage)
                .addOnSuccessListener { barcodes ->
                    Log.d(TAG, "✅ Codes-barres détectés: ${barcodes.size}")
                    
                    val resultArray = Arguments.createArray()
                    barcodes.forEach { barcode ->
                        val barcodeObject = Arguments.createMap().apply {
                            putString("rawValue", barcode.rawValue)
                            putString("displayValue", barcode.displayValue)
                            putString("format", barcode.format.toString())
                            putString("type", barcode.valueType.toString())
                        }
                        resultArray.pushMap(barcodeObject)
                    }
                    
                    promise.resolve(resultArray)
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection de codes-barres", exception)
                    promise.reject("BARCODE_ERROR", "Erreur lors de la détection de codes-barres", exception)
                }
                
        } catch (exception: Exception) {
            Log.e(TAG, "❌ Erreur lors de la détection de codes-barres", exception)
            promise.reject("BARCODE_ERROR", "Erreur lors de la détection de codes-barres", exception)
        }
    }

    // Méthode pour détecter le texte dans une image
    @ReactMethod
    fun detectText(imageUri: String, promise: Promise) {
        try {
            Log.d(TAG, "📝 Début de la détection de texte pour: $imageUri")
            
            val image = loadImageFromUri(imageUri)
            val inputImage = InputImage.fromBitmap(image, 0)
            
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            
            recognizer.process(inputImage)
                .addOnSuccessListener { visionText ->
                    Log.d(TAG, "✅ Texte détecté: ${visionText.text}")
                    
                    val resultArray = Arguments.createArray()
                    visionText.textBlocks.forEach { textBlock ->
                        val textObject = Arguments.createMap().apply {
                            putString("text", textBlock.text)
                            putDouble("confidence", 0.9) // ML Kit ne fournit pas de confidence pour le texte
                        }
                        resultArray.pushMap(textObject)
                    }
                    
                    promise.resolve(resultArray)
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection de texte", exception)
                    promise.reject("TEXT_ERROR", "Erreur lors de la détection de texte", exception)
                }
                
        } catch (exception: Exception) {
            Log.e(TAG, "❌ Erreur lors de la détection de texte", exception)
            promise.reject("TEXT_ERROR", "Erreur lors de la détection de texte", exception)
        }
    }

    // Méthode pour détecter les visages dans une image
    @ReactMethod
    fun detectFaces(imageUri: String, promise: Promise) {
        try {
            Log.d(TAG, "👤 Début de la détection de visages pour: $imageUri")
            
            val image = loadImageFromUri(imageUri)
            val inputImage = InputImage.fromBitmap(image, 0)
            
            val options = FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
                .setContourMode(FaceDetectorOptions.CONTOUR_MODE_NONE)
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
                .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
                .setMinFaceSize(0.15f)
                .build()
            
            val detector = FaceDetection.getClient(options)
            
            detector.process(inputImage)
                .addOnSuccessListener { faces ->
                    Log.d(TAG, "✅ Visages détectés: ${faces.size}")
                    
                    val resultArray = Arguments.createArray()
                    faces.forEachIndexed { index, face ->
                        val faceObject = Arguments.createMap().apply {
                            putInt("id", index)
                            putDouble("confidence", 0.9) // ML Kit ne fournit pas de confidence pour les visages
                            putDouble("rotationY", face.headEulerAngleY.toDouble())
                            putDouble("rotationZ", face.headEulerAngleZ.toDouble())
                        }
                        resultArray.pushMap(faceObject)
                    }
                    
                    promise.resolve(resultArray)
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection de visages", exception)
                    promise.reject("FACE_ERROR", "Erreur lors de la détection de visages", exception)
                }
                
        } catch (exception: Exception) {
            Log.e(TAG, "❌ Erreur lors de la détection de visages", exception)
            promise.reject("FACE_ERROR", "Erreur lors de la détection de visages", exception)
        }
    }

    // Méthode pour analyser complètement une image
    @ReactMethod
    fun analyzeImage(imageUri: String, promise: Promise) {
        try {
            Log.d(TAG, "🚀 Début de l'analyse complète pour: $imageUri")
            
            val image = loadImageFromUri(imageUri)
            val inputImage = InputImage.fromBitmap(image, 0)
            
            val results = Arguments.createMap()
            var completedTasks = 0
            val totalTasks = 4
            var hasError = false
            
            // Fonction pour vérifier si toutes les tâches sont terminées
            fun checkCompletion() {
                completedTasks++
                if (completedTasks == totalTasks && !hasError) {
                    promise.resolve(results)
                }
            }
            
            // Détection d'objets
            val labeler = ImageLabeling.getClient(ImageLabelerOptions.DEFAULT_OPTIONS)
            labeler.process(inputImage)
                .addOnSuccessListener { labels ->
                    val objectsArray = Arguments.createArray()
                    labels.forEach { label ->
                        val labelObject = Arguments.createMap().apply {
                            putString("text", label.text)
                            putDouble("confidence", label.confidence.toDouble())
                        }
                        objectsArray.pushMap(labelObject)
                    }
                    results.putArray("objects", objectsArray)
                    checkCompletion()
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection d'objets", exception)
                    hasError = true
                    promise.reject("ANALYSIS_ERROR", "Erreur lors de l'analyse", exception)
                }
            
            // Détection de codes-barres
            val scanner = BarcodeScanning.getClient()
            scanner.process(inputImage)
                .addOnSuccessListener { barcodes ->
                    val barcodesArray = Arguments.createArray()
                    barcodes.forEach { barcode ->
                        val barcodeObject = Arguments.createMap().apply {
                            putString("rawValue", barcode.rawValue)
                            putString("displayValue", barcode.displayValue)
                            putString("format", barcode.format.toString())
                        }
                        barcodesArray.pushMap(barcodeObject)
                    }
                    results.putArray("barcodes", barcodesArray)
                    checkCompletion()
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection de codes-barres", exception)
                    hasError = true
                    promise.reject("ANALYSIS_ERROR", "Erreur lors de l'analyse", exception)
                }
            
            // Détection de texte
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            recognizer.process(inputImage)
                .addOnSuccessListener { visionText ->
                    val textArray = Arguments.createArray()
                    visionText.textBlocks.forEach { textBlock ->
                        val textObject = Arguments.createMap().apply {
                            putString("text", textBlock.text)
                            putDouble("confidence", 0.9)
                        }
                        textArray.pushMap(textObject)
                    }
                    results.putArray("text", textArray)
                    checkCompletion()
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection de texte", exception)
                    hasError = true
                    promise.reject("ANALYSIS_ERROR", "Erreur lors de l'analyse", exception)
                }
            
            // Détection de visages
            val detector = FaceDetection.getClient(FaceDetectorOptions.Builder().build())
            detector.process(inputImage)
                .addOnSuccessListener { faces ->
                    val facesArray = Arguments.createArray()
                    faces.forEachIndexed { index, face ->
                        val faceObject = Arguments.createMap().apply {
                            putInt("id", index)
                            putDouble("confidence", 0.9)
                        }
                        facesArray.pushMap(faceObject)
                    }
                    results.putArray("faces", facesArray)
                    checkCompletion()
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "❌ Erreur lors de la détection de visages", exception)
                    hasError = true
                    promise.reject("ANALYSIS_ERROR", "Erreur lors de l'analyse", exception)
                }
                
        } catch (exception: Exception) {
            Log.e(TAG, "❌ Erreur lors de l'analyse complète", exception)
            promise.reject("ANALYSIS_ERROR", "Erreur lors de l'analyse", exception)
        }
    }

    // Méthode utilitaire pour charger une image depuis une URI
    private fun loadImageFromUri(imageUri: String): Bitmap {
        return try {
            val uri = Uri.parse(imageUri)
            val inputStream = reactApplicationContext.contentResolver.openInputStream(uri)
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream?.close()
            
            if (bitmap == null) {
                throw IOException("Impossible de décoder l'image")
            }
            
            // Redimensionner l'image si elle est trop grande pour ML Kit
            val maxSize = 1024
            if (bitmap.width > maxSize || bitmap.height > maxSize) {
                val scale = maxSize.toFloat() / maxOf(bitmap.width, bitmap.height)
                val newWidth = (bitmap.width * scale).toInt()
                val newHeight = (bitmap.height * scale).toInt()
                
                Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true)
            } else {
                bitmap
            }
            
        } catch (exception: Exception) {
            Log.e(TAG, "❌ Erreur lors du chargement de l'image", exception)
            throw exception
        }
    }

    // Méthode pour envoyer des événements à React Native
    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
