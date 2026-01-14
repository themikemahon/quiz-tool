import { BrandTheme } from './types';

/**
 * Load a font from a URL by injecting a link element into the document head.
 * This function is idempotent - it won't load the same font URL twice.
 * 
 * @param fontUrl - The URL to the font stylesheet (e.g., Google Fonts URL)
 */
export function loadFont(fontUrl: string): void {
  // Check if this font URL is already loaded
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (existingLink) {
    return;
  }

  // Create and inject the font link element
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  document.head.appendChild(link);
}

/**
 * Apply a brand theme to the document by setting CSS custom properties.
 * This allows the entire application to use the theme colors and fonts
 * through CSS variables.
 * 
 * @param theme - The brand theme to apply
 */
export function applyTheme(theme: BrandTheme | Omit<BrandTheme, 'id'>): void {
  const root = document.documentElement;

  // Set CSS custom properties for colors
  root.style.setProperty('--color-primary', theme.primary_color);
  root.style.setProperty('--color-secondary', theme.secondary_color);
  root.style.setProperty('--color-accent', theme.accent_color);
  root.style.setProperty('--color-text', theme.text_color);
  root.style.setProperty('--color-background', theme.background_color);
  
  // Set font family
  root.style.setProperty('--font-family', theme.font_family);

  // Load custom font if URL is provided
  if (theme.font_url) {
    loadFont(theme.font_url);
  }
}

/**
 * Reset theme to default by removing all custom properties.
 * This is useful for cleanup or testing purposes.
 */
export function resetTheme(): void {
  const root = document.documentElement;
  
  root.style.removeProperty('--color-primary');
  root.style.removeProperty('--color-secondary');
  root.style.removeProperty('--color-accent');
  root.style.removeProperty('--color-text');
  root.style.removeProperty('--color-background');
  root.style.removeProperty('--font-family');
}
