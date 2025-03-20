// This file provides a unified icon component that uses native SFSymbols on iOS and MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, Platform, StyleProp, ViewStyle } from 'react-native';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

// Define the available SF Symbol names
type SFSymbolName = 
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING: Record<SFSymbolName, React.ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
};

export type IconSymbolName = SFSymbolName;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Use native SFSymbols on iOS
  if (Platform.OS === 'ios') {
    // Convert OpaqueColorValue to string if needed
    const colorString = typeof color === 'string' ? color : color.toString();
    return (
      <SymbolView
        name={name}
        size={size}
        colors={[colorString]}
        weight={weight}
        style={style}
      />
    );
  }

  // Fall back to MaterialIcons on Android and web
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style as StyleProp<TextStyle>}
    />
  );
}
