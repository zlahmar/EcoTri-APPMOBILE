import React from 'react';
import { View, Text } from 'react-native';

// Mock du composant Header
const Header = ({ title, showProfileIcon, _isAuthenticated, _onProfilePress }: any) => {
  return (
    <View>
      <Text>{title || 'Header'}</Text>
      {showProfileIcon && <Text>Profile Icon</Text>}
    </View>
  );
};

export default Header;
