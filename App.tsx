import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import SplashScreen from './src/screens/main/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleFinish} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 EcoTri</Text>
      <Text style={styles.subtitle}>Application de Recyclage Intelligent</Text>
      <Text style={styles.status}>✅ SplashScreen fonctionne !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7CB593',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
  },
});
