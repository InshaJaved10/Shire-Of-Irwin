import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconSymbolProps {
  name: string;
  size: number;
  color: string;
}

export function IconSymbol({ name, size, color }: IconSymbolProps) {
  // Map custom icon names to Ionicons names
  const getIconName = (name: string): keyof typeof Ionicons.glyphMap => {
    switch (name) {
      case 'chevron.up':
        return 'chevron-up';
      case 'chevron.down':
        return 'chevron-down';
      default:
        return 'help-outline';
    }
  };

  return <Ionicons name={getIconName(name)} size={size} color={color} />;
} 