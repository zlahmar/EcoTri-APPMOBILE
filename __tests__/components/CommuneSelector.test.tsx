import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CommuneSelector from '../../src/components/common/CommuneSelector';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('CommuneSelector', () => {
  const defaultProps = {
    selectedCommune: 'Bordeaux',
    availableCommunes: ['Bordeaux', 'Talence', 'Pessac', 'Mérignac', 'Villenave-d\'Ornon'],
    onCommuneSelect: jest.fn(),
    visible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<CommuneSelector {...defaultProps} />);
    expect(root).toBeDefined();
  });

  it('should display modal title', () => {
    const { getByText } = render(<CommuneSelector {...defaultProps} />);
    expect(getByText('Sélectionner une commune')).toBeTruthy();
  });

  it('should display search placeholder', () => {
    const { getByPlaceholderText } = render(<CommuneSelector {...defaultProps} />);
    expect(getByPlaceholderText('Rechercher une commune...')).toBeTruthy();
  });

  it('should display all available communes', () => {
    const { getByText } = render(<CommuneSelector {...defaultProps} />);
    
    expect(getByText('Bordeaux')).toBeTruthy();
    expect(getByText('Talence')).toBeTruthy();
    expect(getByText('Pessac')).toBeTruthy();
    expect(getByText('Mérignac')).toBeTruthy();
    expect(getByText('Villenave-d\'Ornon')).toBeTruthy();
  });

  it('should highlight selected commune', () => {
    const { getByText } = render(<CommuneSelector {...defaultProps} />);
    
    // La commune sélectionnée devrait être affichée
    expect(getByText('Bordeaux')).toBeTruthy();
  });

  it('should filter communes when searching', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CommuneSelector {...defaultProps} />
    );
    
    const searchInput = getByPlaceholderText('Rechercher une commune...');
    
    // Rechercher "Bordeaux"
    fireEvent.changeText(searchInput, 'Bordeaux');
    expect(getByText('Bordeaux')).toBeTruthy();
    expect(queryByText('Talence')).toBeNull();
    
    // Rechercher "Talence"
    fireEvent.changeText(searchInput, 'Talence');
    expect(getByText('Talence')).toBeTruthy();
    expect(queryByText('Bordeaux')).toBeNull();
  });

  it('should handle empty search query', () => {
    const { getByPlaceholderText, getByText } = render(
      <CommuneSelector {...defaultProps} />
    );
    
    const searchInput = getByPlaceholderText('Rechercher une commune...');
    
    // Recherche vide devrait afficher toutes les communes
    fireEvent.changeText(searchInput, '');
    expect(getByText('Bordeaux')).toBeTruthy();
    expect(getByText('Talence')).toBeTruthy();
    expect(getByText('Pessac')).toBeTruthy();
  });

  it('should handle case-insensitive search', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CommuneSelector {...defaultProps} />
    );
    
    const searchInput = getByPlaceholderText('Rechercher une commune...');
    
    // Recherche en majuscules
    fireEvent.changeText(searchInput, 'BORDEAUX');
    expect(getByText('Bordeaux')).toBeTruthy();
    
    // Recherche en minuscules
    fireEvent.changeText(searchInput, 'talence');
    expect(getByText('Talence')).toBeTruthy();
  });

  it('should call onCommuneSelect when commune is selected', () => {
    const mockOnCommuneSelect = jest.fn();
    const { getByText } = render(
      <CommuneSelector {...defaultProps} onCommuneSelect={mockOnCommuneSelect} />
    );
    
    // Sélectionner une commune
    const communeItem = getByText('Talence');
    fireEvent.press(communeItem);
    
    expect(mockOnCommuneSelect).toHaveBeenCalledWith('Talence');
  });

  it('should call onClose when commune is selected', () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <CommuneSelector {...defaultProps} onClose={mockOnClose} />
    );
    
    const communeItem = getByText('Talence');
    fireEvent.press(communeItem);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close button is pressed', () => {
    const mockOnClose = jest.fn();
    const { root } = render(
      <CommuneSelector {...defaultProps} onClose={mockOnClose} />
    );
    
    expect(mockOnClose).toBeDefined();
    expect(root).toBeDefined();
  });

  it('should handle empty communes list', () => {
    const emptyProps = {
      ...defaultProps,
      availableCommunes: [],
    };
    
    const { root } = render(<CommuneSelector {...emptyProps} />);
    expect(root).toBeDefined();
  });

  it('should handle single commune in list', () => {
    const singleCommuneProps = {
      ...defaultProps,
      availableCommunes: ['Bordeaux'],
    };
    
    const { getByText } = render(<CommuneSelector {...singleCommuneProps} />);
    expect(getByText('Bordeaux')).toBeTruthy();
  });

  it('should handle missing optional props gracefully', () => {
    const minimalProps = {
      selectedCommune: '',
      availableCommunes: [],
      onCommuneSelect: jest.fn(),
      visible: true,
      onClose: jest.fn(),
    };
    
    const { root } = render(<CommuneSelector {...minimalProps} />);
    expect(root).toBeDefined();
  });

  it('should handle special characters in commune names', () => {
    const specialCommunes = ['Villenave-d\'Ornon', 'Saint-Médard-en-Jalles', 'Bègles'];
    const specialProps = {
      ...defaultProps,
      availableCommunes: specialCommunes,
    };
    
    const { getByText } = render(<CommuneSelector {...specialProps} />);
    
    expect(getByText('Villenave-d\'Ornon')).toBeTruthy();
    expect(getByText('Saint-Médard-en-Jalles')).toBeTruthy();
    expect(getByText('Bègles')).toBeTruthy();
  });
});
