'use client'

import { THEME_CONFIGS } from '../../../../packages/shared/themes'
import { applyThemeConfig } from '../../../../packages/shared/themeUtils'

interface ThemeSwitcherProps {
  activeTheme: string
  onThemeChange: (themeName: string) => void
}

const themes = [
  { key: 'gen', ...THEME_CONFIGS.gen },
  { key: 'avast', ...THEME_CONFIGS.avast },
  { key: 'norton', ...THEME_CONFIGS.norton },
]

export default function ThemeSwitcher({ activeTheme, onThemeChange }: ThemeSwitcherProps) {
  const handleThemeChange = (themeName: string) => {
    const config = THEME_CONFIGS[themeName]
    if (config) {
      applyThemeConfig(config)
      onThemeChange(themeName)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {themes.map((theme) => (
        <button
          key={theme.key}
          onClick={() => handleThemeChange(theme.key)}
          className={`px-3 py-1.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-xs font-semibold transition-[transform,opacity] duration-200 active:scale-[0.96] ${
            activeTheme === theme.key
              ? 'ring-2 ring-offset-1 scale-105'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: theme.primary_color,
            color: theme.button_text_color,
            ['--tw-ring-color' as string]: theme.primary_color,
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {theme.label}
        </button>
      ))}
    </div>
  )
}
