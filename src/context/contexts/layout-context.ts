import { createContext } from 'react'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

// Cookie constants
export const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
export const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
export const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Default values
export const DEFAULT_VARIANT = 'inset'
export const DEFAULT_COLLAPSIBLE = 'icon'

export type LayoutContextType = {
  variant: Variant
  setVariant: (variant: Variant) => void
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void
  resetLayout: () => void
}

export const LayoutContext = createContext<LayoutContextType | null>(null)