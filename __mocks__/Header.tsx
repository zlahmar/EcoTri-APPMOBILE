// __mocks__/Header.tsx
import React from 'react';
import { View, Text } from 'react-native';

const Header = ({ title, showProfileIcon, _isAuthenticated, _onProfilePress }: any) => {
  return (
    <View>
      <Text>{title || 'Header'}</Text>
      {showProfileIcon && <Text>Profile Icon</Text>}
    </View>
  );
};

export default Header;
