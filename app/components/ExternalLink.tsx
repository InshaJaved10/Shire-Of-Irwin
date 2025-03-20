import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ThemedText } from './ThemedText';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  const handlePress = async () => {
    try {
      await WebBrowser.openBrowserAsync(href);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
} 