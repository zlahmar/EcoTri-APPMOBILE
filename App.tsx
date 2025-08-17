import React from 'react';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor="#2E5A3C" />
      <RootNavigator />
    </ErrorBoundary>
  );
}
