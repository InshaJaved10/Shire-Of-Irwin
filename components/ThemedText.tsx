import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? darkColor ?? '#fff' : lightColor ?? '#000';

  return <Text style={[{ color }, style]} {...otherProps} />;
} 