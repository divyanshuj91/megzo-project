import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../styles/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function AnimatedGradientBg({ children, colors, style }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 7500,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 7500,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  // Animate the gradient start/end points to simulate background-position shift
  const startX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const startY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });
  const endX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const endY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <AnimatedLinearGradient
      colors={colors || COLORS.gradientBg}
      start={{ x: startX, y: startY }}
      end={{ x: endX, y: endY }}
      style={[styles.container, style]}
    >
      {children}
    </AnimatedLinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
