import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { components } from './components';
import { productImages } from './images';

export const theme = {
  colors,
  typography,
  spacing,
  components,
  productImages
} as const;

export type Theme = typeof theme;
