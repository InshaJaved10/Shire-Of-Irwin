import React, { useEffect } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router';
import firebaseApp from './app/firebase/config';

// Ignore specific warnings that might cause issues
LogBox.ignoreLogs([
  'Warning: ...',
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  useEffect(() => {
    // Log Firebase initialization
    console.log('Firebase app initialized:', firebaseApp.name);
    
    // Return cleanup function
    return () => {
      console.log('App component unmounted');
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ExpoRoot context={require.context('./app')} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 