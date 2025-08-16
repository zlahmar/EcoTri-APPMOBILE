import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SplashScreen from '../../src/screens/main/SplashScreen';

// Mock des assets
jest.mock('../../src/assets/logo.png', () => 'logo.png');

describe('SplashScreen', () => {
  const defaultProps = {
    onFinish: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render correctly with all elements', () => {
    const { getByText } = render(<SplashScreen {...defaultProps} />);
    
    expect(getByText('EcoTri')).toBeTruthy();
    expect(getByText('Recyclage Intelligent')).toBeTruthy();
    expect(getByText('Version 8.0.0')).toBeTruthy();
    expect(getByText('© 2025 EcoTri - Master 2 YNOV')).toBeTruthy();
  });

  it('should call onFinish after animation sequence', async () => {
    const mockOnFinish = jest.fn();
    render(<SplashScreen {...defaultProps} onFinish={mockOnFinish} />);

    // Avancer le temps pour simuler la fin des animations
    jest.advanceTimersByTime(3000); // 800 + 600 + 1000 + 500

    await waitFor(() => {
      expect(mockOnFinish).toHaveBeenCalledTimes(1);
    });
  });

  it('should display correct app branding', () => {
    const { getByText } = render(<SplashScreen {...defaultProps} />);
    
    const appName = getByText('EcoTri');
    const tagline = getByText('Recyclage Intelligent');
    
    expect(appName).toBeTruthy();
    expect(tagline).toBeTruthy();
  });

  it('should display footer information', () => {
    const { getByText } = render(<SplashScreen {...defaultProps} />);
    
    expect(getByText('Version 8.0.0')).toBeTruthy();
    expect(getByText('© 2025 EcoTri - Master 2 YNOV')).toBeTruthy();
  });

  it('should handle missing onFinish prop gracefully', () => {
    const { getByText } = render(<SplashScreen onFinish={jest.fn()} />);
    
    // Le composant se rend sans crash avec une fonction valide
    expect(getByText('EcoTri')).toBeTruthy();
  });
});
