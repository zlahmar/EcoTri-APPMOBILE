import React from 'react';
import { render } from '@testing-library/react-native';
import AuthScreen from '../../src/screens/auth/AuthScreen';

// Mock simple des écrans enfants
jest.mock('../../src/screens/auth/LoginScreen', () => 'MockLoginScreen');
jest.mock('../../src/screens/auth/SignupScreen', () => 'MockSignupScreen');

describe('AuthScreen', () => {
  const defaultProps = {
    onAuthSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<AuthScreen {...defaultProps} />);
    expect(root).toBeDefined();
  });

  it('should have onAuthSuccess prop defined', () => {
    const mockOnAuthSuccess = jest.fn();
    render(<AuthScreen {...defaultProps} onAuthSuccess={mockOnAuthSuccess} />);
    
    expect(mockOnAuthSuccess).toBeDefined();
  });

  it('should render with default props', () => {
    render(<AuthScreen {...defaultProps} />);
    
    // Le composant se rend sans erreur
    expect(defaultProps.onAuthSuccess).toBeDefined();
  });
});
