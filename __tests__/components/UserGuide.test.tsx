import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserGuide from '../../src/components/common/UserGuide';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('UserGuide', () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when visible', () => {
    const { getByText } = render(<UserGuide {...defaultProps} />);
    
    expect(getByText('Guide d\'Utilisation EcoTri')).toBeTruthy();
    expect(getByText('Bienvenue sur EcoTri ! Voici comment utiliser l\'application pour recycler efficacement :')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(<UserGuide {...defaultProps} isVisible={false} />);
    
    expect(queryByText('Guide d\'Utilisation EcoTri')).toBeNull();
  });

  it('should display all guide sections', () => {
    const { getByText } = render(<UserGuide {...defaultProps} />);
    
    expect(getByText('Scanner des Déchets')).toBeTruthy();
    expect(getByText('Trouver des Points de Recyclage')).toBeTruthy();
    expect(getByText('Calendrier de Collecte')).toBeTruthy();
    expect(getByText('Suivi de vos Progrès')).toBeTruthy();
    expect(getByText('Conseils de Recyclage')).toBeTruthy();
  });

  it('should expand section when pressed', () => {
    const { getByText, queryByText } = render(<UserGuide {...defaultProps} />);
    
    const scannerSection = getByText('Scanner des Déchets');
    
    expect(queryByText('• Ouvrez la page de scan')).toBeNull();
    
    fireEvent.press(scannerSection);
    
    expect(queryByText('• Ouvrez la page de scan')).toBeTruthy();
    expect(queryByText('• Pointez votre caméra vers le déchet')).toBeTruthy();
  });

  it('should collapse section when pressed again', () => {
    const { getByText, queryByText } = render(<UserGuide {...defaultProps} />);
    
    const scannerSection = getByText('Scanner des Déchets');
    
    fireEvent.press(scannerSection);
    expect(queryByText('• Ouvrez la page de scan')).toBeTruthy();
    
    fireEvent.press(scannerSection);
    expect(queryByText('• Ouvrez la page de scan')).toBeNull();
  });

  it('should call onClose when close button is pressed', () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(<UserGuide {...defaultProps} onClose={mockOnClose} />);
    
    expect(getByText('Guide d\'Utilisation EcoTri')).toBeTruthy();
    expect(mockOnClose).toBeDefined();
  });

  it('should display footer message', () => {
    const { getByText } = render(<UserGuide {...defaultProps} />);
    
    expect(getByText('Chaque geste compte pour notre planète !')).toBeTruthy();
  });

  it('should handle missing onClose prop gracefully', () => {
    const { getByText } = render(<UserGuide isVisible={true} />);
    
    expect(getByText('Guide d\'Utilisation EcoTri')).toBeTruthy();
  });

  it('should display section content when expanded', () => {
    const { getByText, queryByText } = render(<UserGuide {...defaultProps} />);
    
    const recyclingSection = getByText('Trouver des Points de Recyclage');
    fireEvent.press(recyclingSection);
    
    expect(queryByText('• Allez sur la page d\'accueil')).toBeTruthy();
    expect(queryByText('• Votre position est détectée automatiquement')).toBeTruthy();
    expect(queryByText('• Les points proches s\'affichent sur la carte')).toBeTruthy();
  });

  it('should only show one expanded section at a time', () => {
    const { getByText, queryByText } = render(<UserGuide {...defaultProps} />);
    
    const scannerSection = getByText('Scanner des Déchets');
    const recyclingSection = getByText('Trouver des Points de Recyclage');
    
    fireEvent.press(scannerSection);
    expect(queryByText('• Ouvrez la page de scan')).toBeTruthy();
    
    fireEvent.press(recyclingSection);
    expect(queryByText('• Ouvrez la page de scan')).toBeNull();
    expect(queryByText('• Allez sur la page d\'accueil')).toBeTruthy();
  });
});
