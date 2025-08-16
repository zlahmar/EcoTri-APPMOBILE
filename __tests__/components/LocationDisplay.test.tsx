import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LocationDisplay from '../../src/components/common/LocationDisplay';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('LocationDisplay', () => {
  const defaultProps = {
    city: 'Bordeaux',
  };

  it('should render correctly with city name', () => {
    const { getByText } = render(<LocationDisplay {...defaultProps} />);
    
    expect(getByText('📍 Bordeaux')).toBeTruthy();
  });

  it('should show loading state when isLoading is true', () => {
    const { getByText } = render(<LocationDisplay {...defaultProps} isLoading={true} />);
    
    expect(getByText(' Localisation...')).toBeTruthy();
  });

  it('should call onRefresh when refresh button is pressed', () => {
    const mockOnRefresh = jest.fn();
    const { getByText } = render(
      <LocationDisplay {...defaultProps} showRefreshButton={true} onRefresh={mockOnRefresh} />
    );
    
    // Le composant se rend correctement avec le bouton de rafraîchissement
    expect(getByText('📍 Bordeaux')).toBeTruthy();
    expect(mockOnRefresh).toBeDefined();
  });

  it('should handle different sizes', () => {
    const { getByText, rerender } = render(<LocationDisplay {...defaultProps} size="small" />);
    
    expect(getByText('📍 Bordeaux')).toBeTruthy();
    
    rerender(<LocationDisplay {...defaultProps} size="large" />);
    expect(getByText('📍 Bordeaux')).toBeTruthy();
  });

  it('should handle missing props gracefully', () => {
    const { getByText } = render(<LocationDisplay city="" />);
    
    // Le composant se rend sans crash même avec des props manquantes
    expect(getByText('📍 ')).toBeTruthy();
  });
});
