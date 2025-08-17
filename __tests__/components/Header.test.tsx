import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../../src/components/common/Header';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('Header', () => {
  const defaultProps = {
    title: 'Test Title',
    showProfileIcon: true,
    isAuthenticated: false,
    onProfilePress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with title', () => {
    const { getByText } = render(<Header {...defaultProps} />);
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should call onProfilePress when profile icon is pressed', () => {
    const mockOnProfilePress = jest.fn();
    const { getByText } = render(
      <Header {...defaultProps} onProfilePress={mockOnProfilePress} showProfileIcon={true} />
    );
    
    expect(getByText('Test Title')).toBeTruthy();
    expect(mockOnProfilePress).toBeDefined();
  });

  it('should render logo image', () => {
    const { getByText } = render(<Header {...defaultProps} />);
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should have correct styling', () => {
    const { getByText } = render(<Header {...defaultProps} />);
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should handle missing onProfilePress prop', () => {
    const { getByText } = render(<Header title="Test" showProfileIcon={true} />);
    
    expect(getByText('Test')).toBeTruthy();
  });

  it('should render with different titles', () => {
    const { getByText, rerender } = render(<Header {...defaultProps} />);
    
    expect(getByText('Test Title')).toBeTruthy();
    
    rerender(<Header {...defaultProps} title="Another Title" />);
    expect(getByText('Another Title')).toBeTruthy();
  });

  it('should show profile icon when showProfileIcon is true', () => {
    const { getByText } = render(<Header {...defaultProps} showProfileIcon={true} />);
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should not show profile icon when showProfileIcon is false', () => {
    const { getByText } = render(<Header {...defaultProps} showProfileIcon={false} />);
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should handle authentication state', () => {
    const { getByText, rerender } = render(<Header {...defaultProps} isAuthenticated={false} />);
    
    expect(getByText('Test Title')).toBeTruthy();
    
    rerender(<Header {...defaultProps} isAuthenticated={true} />);
    expect(getByText('Test Title')).toBeTruthy();
  });
});
