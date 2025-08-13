import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { colors } from '../../styles';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useMemo(() => new Animated.Value(0), []);
  const logoOpacity = useMemo(() => new Animated.Value(0), []);
  const textOpacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animationSequence = Animated.sequence([
      // Animation du logo
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Animation du texte
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Pause
      Animated.delay(1000),
    ]);

    animationSequence.start(() => {
      // Navigation vers l'écran principal après l'animation
      setTimeout(onFinish, 500);
    });
  }, [onFinish, logoScale, logoOpacity, textOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logo,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: textOpacity,
            },
          ]}
        >
          EcoTri
        </Animated.Text>
        
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: textOpacity,
            },
          ]}
        >
          Recyclage Intelligent
        </Animated.Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 2.1.0</Text>
        <Text style={styles.copyright}>© 2025 EcoTri - Master 2 YNOV</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textInverse,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: colors.secondary,
    opacity: 0.8,
  },
});

export default SplashScreen;
