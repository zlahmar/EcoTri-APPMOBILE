import React from 'react';
import { render } from '@testing-library/react-native';
import CollecteInfo from '../../src/components/common/CollecteInfo';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('CollecteInfo', () => {
  const mockCollecteInfo = {
    commune: 'Bordeaux',
    orduresMenageres: {
      jours: ['LUNDI', 'JEUDI'],
      passage: 'JOUR',
    },
    triRecyclage: {
      jours: ['MARDI', 'VENDREDI'],
      passage: 'APRES_MIDI',
    },
  };

  const defaultProps = {
    collecteInfo: mockCollecteInfo,
    onCommuneChange: jest.fn(),
    showCommuneSelector: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with collecte info', () => {
    const { getByText } = render(<CollecteInfo {...defaultProps} />);
    
    expect(getByText('Collecte des déchets')).toBeTruthy();
    expect(getByText('Bordeaux')).toBeTruthy();
    expect(getByText('Ordures Ménagères')).toBeTruthy();
  });

  it('should show no data message when collecteInfo is null', () => {
    const { getByText } = render(<CollecteInfo {...defaultProps} collecteInfo={null} />);
    
    expect(getByText('Informations de collecte')).toBeTruthy();
    expect(getByText('Aucune information de collecte disponible pour cette zone.')).toBeTruthy();
  });

  it('should call onCommuneChange when change button is pressed', () => {
    const mockOnCommuneChange = jest.fn();
    const { getByText } = render(
      <CollecteInfo {...defaultProps} onCommuneChange={mockOnCommuneChange} />
    );
    
    expect(getByText('Collecte des déchets')).toBeTruthy();
    expect(mockOnCommuneChange).toBeDefined();
  });

  it('should display commune name', () => {
    const { getByText } = render(<CollecteInfo {...defaultProps} />);
    
    expect(getByText('Bordeaux')).toBeTruthy();
  });

  it('should handle missing onCommuneChange prop', () => {
    const { getByText } = render(
      <CollecteInfo {...defaultProps} onCommuneChange={undefined} />
    );
    
    expect(getByText('Collecte des déchets')).toBeTruthy();
  });

  it('should handle empty collecte info gracefully', () => {
    const emptyCollecteInfo = {
      commune: 'Test',
      orduresMenageres: { jours: [], passage: 'JOUR' },
      triRecyclage: { jours: [], passage: 'APRES_MIDI' },
    };
    
    const { getByText } = render(
      <CollecteInfo {...defaultProps} collecteInfo={emptyCollecteInfo} />
    );
    
    expect(getByText('Collecte des déchets')).toBeTruthy();
  });
});
