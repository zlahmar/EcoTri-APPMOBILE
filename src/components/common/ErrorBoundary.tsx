import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>🚨 Oups ! Une erreur s'est produite</Text>
          <Text style={styles.message}>
            L'application a rencontré un problème inattendu.
          </Text>
          {__DEV__ && this.state.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Détails de l'erreur :</Text>
              <Text style={styles.errorText}>{this.state.error.toString()}</Text>
              {this.state.errorInfo && (
                <Text style={styles.errorText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <Text style={styles.buttonText}>Redémarrer l'App</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    width: '100%',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#c62828',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
