// Saarthi Design Tokens — extracted from web CSS variables
export const Colors = {
  // Primary palette
  primary: '#012d1d',
  onPrimary: '#ffffff',
  primaryContainer: '#1b4332',
  onPrimaryContainer: '#86af99',
  primaryFixed: '#c1ecd4',
  primaryFixedDim: '#a5d0b9',

  // Secondary palette
  secondary: '#006c48',
  onSecondary: '#ffffff',
  secondaryContainer: '#92f7c3',
  onSecondaryContainer: '#00734d',
  secondaryFixed: '#92f7c3',
  secondaryFixedDim: '#75daa8',

  // Tertiary palette
  tertiary: '#00293d',
  onTertiary: '#ffffff',
  tertiaryContainer: '#00405c',
  onTertiaryContainer: '#77acd0',
  tertiaryFixed: '#c7e7ff',
  tertiaryFixedDim: '#98cdf2',

  // Error palette
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Surface palette
  surface: '#f9faf2',
  surfaceDim: '#d9dbd3',
  surfaceBright: '#f9faf2',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f3f4ec',
  surfaceContainer: '#edefe7',
  surfaceContainerHigh: '#e8e9e1',
  surfaceContainerHighest: '#e2e3db',
  onSurface: '#1a1c18',
  onSurfaceVariant: '#414844',
  surfaceVariant: '#e2e3db',
  surfaceTint: '#3f6653',

  // Other
  outline: '#717973',
  outlineVariant: '#e2e3db',
  background: '#f9faf2',
  onBackground: '#1a1c18',
  inverseSurface: '#2f312c',
  inverseOnSurface: '#f0f1e9',
  inversePrimary: '#a5d0b9',

  // Status / accent
  statusGreen: '#dcfce7',
  statusGreenText: '#006c48',
  highlight: '#92f7c3',
  highlightText: '#00734d',

  // Neutrals
  white: '#ffffff',
  black: '#000000',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  containerPadding: 24,
  stackGap: 24,
  touchTargetMin: 56,
  gutter: 16,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#012d1d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardPressed: {
    shadowColor: '#012d1d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  mic: {
    shadowColor: 'rgba(0,108,72,0.25)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 10,
  },
};
