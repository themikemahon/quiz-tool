import { BrandTheme } from './types';

/**
 * Extended theme config with heading/body font split.
 * These are used client-side for the theme switcher.
 */
export interface ThemeConfig {
  name: string;
  label: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  heading_font: string;
  body_font: string;
  button_text_color: string;
  font_url?: string;
}

export const BRAND_THEMES: Record<string, Omit<BrandTheme, 'id'>> = {
  default: {
    name: 'default',
    primary_color: '#3B82F6',
    secondary_color: '#6366F1',
    accent_color: '#3B82F6',
    text_color: '#111827',
    background_color: '#F3F4F6',
    font_family: 'Inter, system-ui, sans-serif',
    font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
  },
  gen: {
    name: 'gen',
    primary_color: '#3D3BF6',
    secondary_color: '#2A3042',
    accent_color: '#9747FF',
    text_color: '#2A3042',
    background_color: '#FFFFFF',
    font_family: "'Source Sans Pro', sans-serif",
    font_url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap'
  },
  avast: {
    name: 'avast',
    primary_color: '#FF7800',
    secondary_color: '#1B2430',
    accent_color: '#FF7800',
    text_color: '#1B2430',
    background_color: '#FFFFFF',
    font_family: "'Mier B', sans-serif",
    font_url: undefined
  },
  norton: {
    name: 'norton',
    primary_color: '#FDB511',
    secondary_color: '#2D2D2D',
    accent_color: '#FDB511',
    text_color: '#2D2D2D',
    background_color: '#FFFFFF',
    font_family: "'Inter', sans-serif",
    font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
  },
  lifelock: {
    name: 'lifelock',
    primary_color: '#0066CC',
    secondary_color: '#003366',
    accent_color: '#0066CC',
    text_color: '#333333',
    background_color: '#F5F5F5',
    font_family: 'Arial, Helvetica, sans-serif',
    font_url: undefined
  },
};

/**
 * Extended theme configs with heading/body font split for the theme switcher.
 */
export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  gen: {
    name: 'gen',
    label: 'Gen',
    primary_color: '#3D3BF6',
    secondary_color: '#2A3042',
    accent_color: '#9747FF',
    text_color: '#2A3042',
    background_color: '#FFFFFF',
    heading_font: "'Source Sans Pro', sans-serif",
    body_font: "'Roboto', sans-serif",
    button_text_color: '#FFFFFF',
    font_url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap',
  },
  avast: {
    name: 'avast',
    label: 'Avast',
    primary_color: '#FF7800',
    secondary_color: '#1B2430',
    accent_color: '#FF7800',
    text_color: '#1B2430',
    background_color: '#FFFFFF',
    heading_font: "'Mier B', sans-serif",
    body_font: "'Mier B', sans-serif",
    button_text_color: '#FFFFFF',
  },
  norton: {
    name: 'norton',
    label: 'Norton',
    primary_color: '#FDB511',
    secondary_color: '#2D2D2D',
    accent_color: '#FDB511',
    text_color: '#2D2D2D',
    background_color: '#FFFFFF',
    heading_font: "'Inter', sans-serif",
    body_font: "'Inter', sans-serif",
    button_text_color: '#2D2D2D',
    font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  },
};

/**
 * Get all available brand themes as an array
 */
export function getAllThemes(): Omit<BrandTheme, 'id'>[] {
  return Object.values(BRAND_THEMES);
}

/**
 * Get a specific theme by name
 */
export function getThemeByName(name: string): Omit<BrandTheme, 'id'> | undefined {
  return BRAND_THEMES[name];
}
