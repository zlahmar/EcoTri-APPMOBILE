import React, { useState, useEffect } from 'react';
import SplashScreen from '../screens/main/SplashScreen';
import MainNavigator from './MainNavigator';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return <MainNavigator />;
};

export default RootNavigator;
