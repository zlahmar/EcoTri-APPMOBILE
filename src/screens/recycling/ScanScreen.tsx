import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../../styles';
import Header from '../../components/common/Header';

const ScanScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Scanner de Déchets" />
      
      <View style={styles.content}>
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <Text style={styles.scanIcon}>📱</Text>
            <Text style={styles.scanText}>Scanner un déchet</Text>
            <Text style={styles.scanSubtext}>
              Pointez votre caméra vers le code-barres ou l'objet
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Démarrer le Scan</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Comment ça marche ?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>1️⃣</Text>
            <Text style={styles.infoText}>Pointez la caméra vers le déchet</Text>
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
      </View>
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
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
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
