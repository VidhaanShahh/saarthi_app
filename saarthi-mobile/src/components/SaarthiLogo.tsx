import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface SaarthiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SaarthiLogo: React.FC<SaarthiLogoProps> = ({ size = 'md', showText = true }) => {
  const dimensions = {
    sm: { icon: 28, fontSize: 18 },
    md: { icon: 36, fontSize: 22 },
    lg: { icon: 44, fontSize: 28 },
  };

  const { icon, fontSize } = dimensions[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: icon, height: icon, borderRadius: icon / 2 }]}>
        <Svg width={icon * 0.6} height={icon * 0.6} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill={Colors.white}
          />
        </Svg>
      </View>
      {showText && (
        <Text style={[styles.logoText, { fontSize }]}>Saarthi</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
});
