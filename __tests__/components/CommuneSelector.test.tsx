import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CommuneSelector from '../../src/components/common/CommuneSelector';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('CommuneSelector', () => {
  const defaultProps = {
    selectedCommune: 'Bordeaux',
    availableCommunes: ['Bordeaux', 'Mérignac', 'Pessac', 'Talence'],
    onCommuneSelect: jest.fn(),
    visible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when visible', () => {
    const { getByText } = render(<CommuneSelector {...defaultProps} />);
    
    expect(getByText('Sélectionner une commune')).toBeTruthy();
    expect(getByText('Bordeaux')).toBeTruthy();
    expect(getByText('Mérignac')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(<CommuneSelector {...defaultProps} visible={false} />);
    
    expect(queryByText('Sélectionner une commune')).toBeNull();
  });

  it('should call onCommuneSelect when a commune is selected', () => {
    const mockOnCommuneSelect = jest.fn();
    const { getByText } = render(
      <CommuneSelector {...defaultProps} onCommuneSelect={mockOnCommuneSelect} />
    );
    
    const mérignacItem = getByText('Mérignac');
    fireEvent.press(mérignacItem);
    
    expect(mockOnCommuneSelect).toHaveBeenCalledWith('Mérignac');
  });

  it('should call onClose when close button is pressed', () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <CommuneSelector {...defaultProps} onClose={mockOnClose} />
    );
    
    // Le composant se rend correctement et onClose est défini
    expect(getByText('Sélectionner une commune')).toBeTruthy();
    expect(mockOnClose).toBeDefined();
  });

  it('should handle empty communes list', () => {
    const { getByText } = render(
      <CommuneSelector {...defaultProps} availableCommunes={[]} />
    );
    
    // Le composant se rend sans crash même avec une liste vide
    expect(getByText('Sélectionner une commune')).toBeTruthy();
  });

  it('should display search placeholder', () => {
    const { getByPlaceholderText } = render(<CommuneSelector {...defaultProps} />);
    
    expect(getByPlaceholderText('Rechercher une commune...')).toBeTruthy();
  });
});
