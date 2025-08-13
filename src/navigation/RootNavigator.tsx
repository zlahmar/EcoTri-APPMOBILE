import React, { useState, useEffect } from 'react';
import SplashScreen from '../screens/main/SplashScreen';
import MainNavigator from './MainNavigator';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulation du chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Ici on pourrait vérifier l'état d'authentification
      setIsAuthenticated(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return <MainNavigator />;
};

export default RootNavigator;
