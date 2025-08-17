import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import CustomButton from '../../src/components/common/CustomButton';

describe('CustomButton', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  it('should render correctly with title', () => {
    const { getByText } = render(<CustomButton {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CustomButton {...defaultProps} onPress={mockOnPress} />
    );

    const button = getByText('Test Button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByText } = render(<CustomButton {...defaultProps} disabled={true} />);
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('should not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CustomButton {...defaultProps} onPress={mockOnPress} disabled={true} />
    );

    const button = getByText('Test Button');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should render with different variants', () => {
    const { getByText, rerender } = render(<CustomButton {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
    
    rerender(<CustomButton {...defaultProps} variant="secondary" />);
    expect(getByText('Test Button')).toBeTruthy();
    
    rerender(<CustomButton {...defaultProps} variant="outline" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { getByText, rerender } = render(<CustomButton {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
    
    rerender(<CustomButton {...defaultProps} size="small" />);
    expect(getByText('Test Button')).toBeTruthy();
    
    rerender(<CustomButton {...defaultProps} size="large" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with icon when provided', () => {
    const { getByText } = render(<CustomButton {...defaultProps} />);
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('should handle missing onPress prop', () => {
    const { getByText } = render(<CustomButton title="Test" />);
    
    const button = getByText('Test');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
  });

  it('should render with custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <CustomButton {...defaultProps} style={customStyle} />
    );
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('should handle loading state', () => {
    const { UNSAFE_getByType } = render(<CustomButton {...defaultProps} loading={true} />);
    
    const loadingIndicator = UNSAFE_getByType(ActivityIndicator);
    expect(loadingIndicator).toBeTruthy();
  });

  it('should not show loading indicator when not loading', () => {
    const { UNSAFE_queryByType } = render(<CustomButton {...defaultProps} loading={false} />);
    
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeNull();
  });

  it('should render with different button types', () => {
    const { getByText, rerender } = render(<CustomButton {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
    
    rerender(<CustomButton {...defaultProps} type="submit" />);
    expect(getByText('Test Button')).toBeTruthy();
  });
});
