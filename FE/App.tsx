import React from 'react';
import { View, ActivityIndicator, StyleSheet, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import useAuthStore from './src/store/useAuthStore';
import InternLoginScreen from './src/screens/Auth/InternLoginScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const { intern, loading, saveCurrentIntern, error } = useAuthStore();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A74FF" />
      </SafeAreaView>
    );
  }

  if (intern) {
    return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.globalError}>{error}</Text> : null}
      <InternLoginScreen onLoginSuccess={saveCurrentIntern} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  globalError: {
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 24,
    fontSize: 14,
  },
});
