import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

interface LocationDisplayProps {
  city: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  city,
  isLoading = false,
  onRefresh,
  showRefreshButton = false,
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 14,
          textSize: 12,
          containerMargin: 4,
        };
      case 'large':
        return {
          iconSize: 20,
          textSize: 16,
          containerMargin: 12,
        };
      default: // medium
        return {
          iconSize: 16,
          textSize: 14,
          containerMargin: 8,
        };
    }
  };

  const { iconSize, textSize, containerMargin } = getSizeStyles();

  return (
    <View style={[styles.container, { marginTop: containerMargin }]}>
      <MaterialIcons 
        name="location-on" 
        size={iconSize} 
        color={colors.primary} 
      />
      <Text style={[styles.locationText, { fontSize: textSize }]}>
        {isLoading ? '📍 Localisation...' : `📍 ${city}`}
      </Text>
      {showRefreshButton && onRefresh && (
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
        >
          <MaterialIcons 
            name="refresh" 
            size={iconSize - 2} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
  refreshButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default LocationDisplay;
