import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

type Props = ViewProps & {
  darkColor?: string;
  lightColor?: string;
};

export function ThemedView(props: Props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? darkColor : lightColor;

  return (
    <View style={[{ backgroundColor }, style]} {...otherProps} />
  );
} 