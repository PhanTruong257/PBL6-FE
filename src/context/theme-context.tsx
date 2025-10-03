import { createContext } from 'react'

export type Theme =
  | 'light'
  | 'dark'
  | 'galaxy'
  | 'dracula'
  | 'nord'
  | 'ocean'
  | 'sunset'
  | 'forest'

export type ThemeInfo = {
  name: Theme
  label: string
  description: string
}

export type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: ThemeInfo[]
}

export const AVAILABLE_THEMES: ThemeInfo[] = [
  { name: 'light',
    label: 'Sáng',
    description: 'Giao diện sáng cơ bản'
  },
  { name: 'dark',
    label: 'Tối',
    description: 'Giao diện tối cơ bản'
  },
  {
    name: 'galaxy',
    label: 'Galaxy',
    description: 'Theme không gian galaxy',
  },
  {
    name: 'dracula',
    label: 'Dracula',
    description: 'Theme màu tím Dracula',
  },
  {
    name: 'nord',
    label: 'Nord',
    description: 'Theme màu xanh Bắc Âu'
  },
  {
    name: 'ocean',
    label: 'Ocean',
    description: 'Theme màu xanh đại dương' },
  {
    name: 'sunset',
    label: 'Sunset',
    description: 'Theme màu hoàng hôn',
  },
  {
    name: 'forest',
    label: 'Forest',
    description: 'Theme màu xanh rừng',
  },
] as const

const initialState: ThemeContextType = {
  theme: 'light',
  setTheme: () => null,
  themes: AVAILABLE_THEMES,
}

/**
 * Create context object for theme management. Using with ThemeProvider to provide state.
 * Default value is light theme with no-op setter.
 */
export const ThemeContext = createContext<ThemeContextType>(initialState)
