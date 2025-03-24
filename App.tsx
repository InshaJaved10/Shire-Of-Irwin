import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, Platform } from 'react-native';
import * as Updates from 'expo-updates';

export default function App() {
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check for updates on app load with a delay to ensure initialization
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  async function checkForUpdates() {
    try {
      setIsChecking(true);
      setErrorMessage('');
      
      // If on Android, ensure we have a stable connection first
      if (Platform.OS === 'android') {
        console.log('Android detected, ensuring stable connection for updates');
      }
      
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        Alert.alert(
          "Update Available",
          "A new update is available. Downloading now..."
        );
        
        try {
          await Updates.fetchUpdateAsync();
          
          Alert.alert(
            "Update Downloaded",
            "Update has been downloaded. Restart to apply changes.",
            [
              { 
                text: "Restart Now", 
                onPress: () => {
                  try {
                    Updates.reloadAsync();
                  } catch (reloadError) {
                    console.error('Error reloading app:', reloadError);
                  }
                }
              },
              { 
                text: "Later" 
              }
            ]
          );
        } catch (downloadError: any) {
          console.error('Error downloading update:', downloadError);
          // Check if it's the IOException
          if (downloadError.message && downloadError.message.includes('IOException')) {
            setErrorMessage('Failed to download update. Please check your internet connection and try again.');
          } else {
            setErrorMessage('Error downloading update: ' + downloadError.message);
          }
        }
      } else {
        console.log('No updates available');
      }
    } catch (error: any) {
      console.error('Error checking for updates:', error);
      setErrorMessage('Error checking for updates: ' + 
        (error.message || 'Unknown error. Please try again later.'));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shire Of Irwin</Text>
        <Text style={styles.subtitle}>Welcome to the app!</Text>
        
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
        
        <Button 
          title={isChecking ? "Checking..." : "Check for Updates"} 
          onPress={checkForUpdates} 
          disabled={isChecking}
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  errorContainer: {
    backgroundColor: '#ffeded',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  }
}); 