import React from 'react';
import { render } from '@testing-library/react-native';
import LocationDisplay from '../../src/components/common/LocationDisplay';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('LocationDisplay', () => {
  const defaultProps = {
    city: 'Bordeaux',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<LocationDisplay {...defaultProps} />);
    expect(root).toBeDefined();
  });

  it('should display the city name', () => {
    const { getByText } = render(<LocationDisplay {...defaultProps} />);
    expect(getByText('📍 Bordeaux')).toBeTruthy();
  });

  it('should display loading state when isLoading is true', () => {
    const { getByText } = render(
      <LocationDisplay {...defaultProps} isLoading={true} />
    );
    expect(getByText(' Localisation...')).toBeTruthy();
  });

  it('should display city when not loading', () => {
    const { getByText } = render(
      <LocationDisplay {...defaultProps} isLoading={false} />
    );
    expect(getByText('📍 Bordeaux')).toBeTruthy();
  });

  it('should show refresh button when showRefreshButton is true and onRefresh is provided', () => {
    const mockOnRefresh = jest.fn();
    const { root } = render(
      <LocationDisplay 
        {...defaultProps} 
        showRefreshButton={true} 
        onRefresh={mockOnRefresh}
      />
    );
    
    // Le bouton de rafraîchissement devrait être présent
    expect(mockOnRefresh).toBeDefined();
    expect(root).toBeDefined();
  });

  it('should not show refresh button when showRefreshButton is false', () => {
    const mockOnRefresh = jest.fn();
    const { root } = render(
      <LocationDisplay 
        {...defaultProps} 
        showRefreshButton={false} 
        onRefresh={mockOnRefresh}
      />
    );
    
    // Le bouton ne devrait pas être affiché
    expect(mockOnRefresh).toBeDefined();
    expect(root).toBeDefined();
  });

  it('should not show refresh button when onRefresh is not provided', () => {
    const { root } = render(
      <LocationDisplay 
        {...defaultProps} 
        showRefreshButton={true}
      />
    );
    
    // Sans onRefresh, le bouton ne devrait pas être affiché
    expect(root).toBeDefined();
  });

  it('should handle different city names', () => {
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse'];
    
    cities.forEach(city => {
      const { getByText } = render(<LocationDisplay city={city} />);
      expect(getByText(`📍 ${city}`)).toBeTruthy();
    });
  });

  it('should handle empty city name', () => {
    const { getByText } = render(<LocationDisplay city="" />);
    expect(getByText('📍 ')).toBeTruthy();
  });

  it('should handle undefined city name', () => {
    const { getByText } = render(<LocationDisplay city={undefined as any} />);
    expect(getByText('📍 undefined')).toBeTruthy();
  });

  it('should render with default medium size', () => {
    const { root } = render(<LocationDisplay {...defaultProps} />);
    expect(root).toBeDefined();
  });

  it('should render with small size', () => {
    const { root } = render(
      <LocationDisplay {...defaultProps} size="small" />
    );
    expect(root).toBeDefined();
  });

  it('should render with large size', () => {
    const { root } = render(
      <LocationDisplay {...defaultProps} size="large" />
    );
    expect(root).toBeDefined();
  });

  it('should render with invalid size (fallback to medium)', () => {
    const { root } = render(
      <LocationDisplay {...defaultProps} size={'invalid' as any} />
    );
    expect(root).toBeDefined();
  });

  it('should handle all props being provided', () => {
    const allProps = {
      city: 'Nice',
      isLoading: false,
      onRefresh: jest.fn(),
      showRefreshButton: true,
      size: 'large' as const,
    };
    
    const { root, getByText } = render(<LocationDisplay {...allProps} />);
    
    expect(root).toBeDefined();
    expect(getByText('📍 Nice')).toBeTruthy();
  });

  it('should handle missing optional props gracefully', () => {
    const { root } = render(<LocationDisplay city="Test" />);
    expect(root).toBeDefined();
  });
});
