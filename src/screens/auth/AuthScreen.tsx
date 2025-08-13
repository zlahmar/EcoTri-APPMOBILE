import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import { UserData } from '../../services/authService';

interface AuthScreenProps {
  onAuthSuccess: (userData?: UserData) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleAuthSuccess = (userData?: UserData) => {
    onAuthSuccess(userData);
  };

  if (isLogin) {
    return (
      <LoginScreen
        onLoginSuccess={handleAuthSuccess}
        onSwitchToSignup={handleSwitchToSignup}
      />
    );
  }

  return (
    <SignupScreen
      onSignupSuccess={handleAuthSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

export default AuthScreen;
