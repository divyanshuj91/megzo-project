import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SHADOWS, SIZES } from '../styles/theme';

export default function GlassCard({ children, style, onPress, noHover, blurIntensity = 40 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (noHover) return;
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 8 }),
      Animated.spring(translateYAnim, { toValue: -5, useNativeDriver: true, friction: 8 }),
    ]).start();
  };

  const handlePressOut = () => {
    if (noHover) return;
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8 }),
      Animated.spring(translateYAnim, { toValue: 0, useNativeDriver: true, friction: 8 }),
    ]).start();
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        },
        style,
      ]}
    >
      <BlurView intensity={blurIntensity} tint="light" style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glassWhite,
    ...SHADOWS.medium,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: SIZES.radiusLg,
  },
  inner: {
    padding: SIZES.padding,
  },
});
