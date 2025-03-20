import React, { useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useColorScheme } from 'react-native';

interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
  style?: StyleProp<ViewStyle>;
}

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  style,
}: ParallaxScrollViewProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const headerBgColor = headerBackgroundColor?.[colorScheme || 'light'] || '#fff';

  const headerHeight = 200;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [-headerHeight, 0, headerHeight],
    outputRange: [1.5, 1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: headerBgColor,
            transform: [
              { translateY: headerTranslateY },
              { scale: headerScale },
            ],
          },
        ]}>
        {headerImage}
      </Animated.View>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}>
        <View style={styles.content}>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 200,
  },
  content: {
    padding: 20,
  },
}); 