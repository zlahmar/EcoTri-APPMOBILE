import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

interface HeaderProps {
  title: string;
  showProfileIcon?: boolean;
  isAuthenticated?: boolean;
  onProfilePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showProfileIcon = false,
  isAuthenticated = false,
  onProfilePress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {showProfileIcon && (
          <TouchableOpacity style={styles.profileIcon} onPress={onProfilePress}>
            <MaterialIcons
              name={isAuthenticated ? 'account-circle' : 'person-outline'}
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingTop: 32,
    paddingBottom: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    width: 60,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textInverse,
    textAlign: 'center',
  },
  rightSection: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
