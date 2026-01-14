import { BrandTheme } from './types';

/**
 * Brand theme configurations for the quiz system.
 * These themes define color palettes and font configurations for each brand.
 * 
 * Colors are extracted from respective brand websites as proof of concept.
 */
export const BRAND_THEMES: Record<string, Omit<BrandTheme, 'id'>> = {
  default: {
    name: 'default',
    primary_color: '#3B82F6',      // Blue-600
    secondary_color: '#6366F1',    // Indigo-500
    accent_color: '#3B82F6',       // Blue-600
    text_color: '#111827',         // Gray-900
    background_color: '#F3F4F6',   // Gray-100
    font_family: 'Inter, system-ui, sans-serif',
    font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  },
  avast: {
    name: 'avast',
    primary_color: '#FF7F00',      // Avast Orange
    secondary_color: '#000000',    // Black
    accent_color: '#FF7F00',       // Orange
    text_color: '#000000',         // Black
    background_color: '#FFFFFF',   // White
    font_family: 'Arial, Helvetica, sans-serif',
    font_url: undefined
  },
  norton: {
    name: 'norton',
    primary_color: '#FDB511',      // Norton Yellow
    secondary_color: '#000000',    // Black
    accent_color: '#FDB511',       // Yellow
    text_color: '#000000',         // Black
    background_color: '#FFFFFF',   // White
    font_family: 'Arial, Helvetica, sans-serif',
    font_url: undefined
  },
  lifelock: {
    name: 'lifelock',
    primary_color: '#0066CC',      // LifeLock Blue
    secondary_color: '#003366',    // Dark Blue
    accent_color: '#0066CC',       // Blue
    text_color: '#333333',         // Dark Gray
    background_color: '#F5F5F5',   // Light Gray
    font_family: 'Arial, Helvetica, sans-serif',
    font_url: undefined
  },
  gen: {
    name: 'gen',
    primary_color: '#1E40AF',      // Gen Blue
    secondary_color: '#6366F1',    // Indigo
    accent_color: '#3B82F6',       // Light Blue
    text_color: '#111827',         // Gray-900
    background_color: '#F9FAFB',   // Gray-50
    font_family: 'system-ui, -apple-system, sans-serif',
    font_url: undefined
  }
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
