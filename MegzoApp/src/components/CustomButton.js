import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../styles/theme';

export default function CustomButton({ title, onPress, variant = 'primary', style, textStyle, fullWidth, disabled }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary'; // blue
  const isAuth = variant === 'auth'; // purple gradient style

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, friction: 8 }),
      Animated.timing(overlayAnim, { toValue: 0.15, duration: 150, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8 }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const getBgColor = () => {
    if (disabled) return COLORS.gray400;
    if (isSecondary) return COLORS.btnBlue;
    if (isAuth) return COLORS.authPurple;
    return COLORS.btnYellow;
  };

  const getTextColor = () => {
    if (isSecondary || isAuth) return COLORS.white;
    return COLORS.black;
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: getBgColor(), transform: [{ scale: scaleAnim }] },
          fullWidth && styles.fullWidth,
          isAuth && styles.authButton,
          style,
        ]}
      >
        {/* Overlay (replaces ::before hover effect) */}
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayAnim },
          ]}
        />
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            isAuth && styles.authText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  authButton: {
    borderRadius: 10,
    paddingVertical: 14,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 6,
  },
  overlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#726b6b',
  },
  text: {
    ...FONTS.extraBold,
    fontSize: SIZES.md,
    zIndex: 1,
  },
  authText: {
    fontSize: SIZES.lg,
    ...FONTS.semiBold,
  },
});
