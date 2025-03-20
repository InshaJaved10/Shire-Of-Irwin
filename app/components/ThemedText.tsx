import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'default' | 'defaultSemiBold';
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  children, 
  type = 'default',
  style,
  ...props 
}) => {
  return (
    <Text
      style={[
        styles[type],
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  default: {
    fontSize: 16,
    color: '#666',
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
}); 