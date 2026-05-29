import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, FONTS, SIZES, GLASS_HEADER } from '../styles/theme';

export default function GlassHeader({ title, leftAction, rightAction, navigation }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="light" style={styles.blur}>
        <View style={styles.inner}>
          {/* Left */}
          <View style={styles.side}>
            {leftAction ? (
              leftAction
            ) : navigation ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Center */}
          <View style={styles.center}>
            <Text style={styles.title} numberOfLines={1}>
              {title || 'MEGZO'}
            </Text>
          </View>

          {/* Right */}
          <View style={[styles.side, styles.rightSide]}>
            {rightAction || null}
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    ...GLASS_HEADER,
  },
  blur: {
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT + 8,
    paddingBottom: 12,
  },
  side: {
    width: 60,
    alignItems: 'flex-start',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.xxl,
    color: COLORS.gray900,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    fontSize: 24,
    color: COLORS.gray800,
    ...FONTS.bold,
  },
});
