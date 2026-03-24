import { BrandTheme } from './types';
import { ThemeConfig } from './themes';

/**
 * Load a font from a URL by injecting a link element into the document head.
 */
export function loadFont(fontUrl: string): void {
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  document.head.appendChild(link);
}

/**
 * Apply a brand theme to the document by setting CSS custom properties.
 */
export function applyTheme(theme: BrandTheme | Omit<BrandTheme, 'id'>): void {
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary_color);
  root.style.setProperty('--color-secondary', theme.secondary_color);
  root.style.setProperty('--color-accent', theme.accent_color);
  root.style.setProperty('--color-text', theme.text_color);
  root.style.setProperty('--color-background', theme.background_color);
  root.style.setProperty('--font-family', theme.font_family);
  // Default heading/body to the same font family
  root.style.setProperty('--font-heading', theme.font_family);
  root.style.setProperty('--font-body', theme.font_family);

  if (theme.font_url) {
    loadFont(theme.font_url);
  }
}

/**
 * Apply an extended theme config with separate heading/body fonts.
 */
export function applyThemeConfig(theme: ThemeConfig): void {
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary_color);
  root.style.setProperty('--color-secondary', theme.secondary_color);
  root.style.setProperty('--color-accent', theme.accent_color);
  root.style.setProperty('--color-text', theme.text_color);
  root.style.setProperty('--color-background', theme.background_color);
  root.style.setProperty('--font-heading', theme.heading_font);
  root.style.setProperty('--font-body', theme.body_font);
  root.style.setProperty('--font-family', theme.body_font);
  root.style.setProperty('--color-button-text', theme.button_text_color);

  // Set data-theme for brand-specific CSS overrides (e.g. Norton design treatments)
  root.dataset.theme = theme.name;

  if (theme.font_url) {
    loadFont(theme.font_url);
  }
}

/**
 * Reset theme to default by removing all custom properties.
 */
export function resetTheme(): void {
  const root = document.documentElement;

  root.style.removeProperty('--color-primary');
  root.style.removeProperty('--color-secondary');
  root.style.removeProperty('--color-accent');
  root.style.removeProperty('--color-text');
  root.style.removeProperty('--color-background');
  root.style.removeProperty('--font-family');
  root.style.removeProperty('--font-heading');
  root.style.removeProperty('--font-body');
  root.style.removeProperty('--color-button-text');
  delete root.dataset.theme;
}
