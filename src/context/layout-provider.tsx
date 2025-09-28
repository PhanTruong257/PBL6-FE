import { useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { Variant, Collapsible } from './contexts/layout-context'
import {
  LayoutContext,
  LAYOUT_COLLAPSIBLE_COOKIE_NAME,
  LAYOUT_VARIANT_COOKIE_NAME,
  LAYOUT_COOKIE_MAX_AGE,
  DEFAULT_VARIANT,
  DEFAULT_COLLAPSIBLE
} from './contexts/layout-context'

type LayoutProviderProps = {
  children: React.ReactNode
  defaultVariant?: Variant
  defaultCollapsible?: Collapsible
}

export function LayoutProvider({
  children,
  defaultVariant = DEFAULT_VARIANT,
  defaultCollapsible = DEFAULT_COLLAPSIBLE,
}: LayoutProviderProps) {
  // Initialize variant from cookie or default
  const [variant, setVariantState] = useState<Variant>(() => {
    const variantCookie = getCookie(LAYOUT_VARIANT_COOKIE_NAME) as Variant
    if (
      variantCookie &&
      (variantCookie === 'inset' || 
       variantCookie === 'sidebar' || 
       variantCookie === 'floating')
    ) {
      return variantCookie
    }
    return defaultVariant
  })

  // Initialize collapsible from cookie or default
  const [collapsible, setCollapsibleState] = useState<Collapsible>(() => {
    const collapsibleCookie = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME) as Collapsible
    if (
      collapsibleCookie &&
      (collapsibleCookie === 'offcanvas' || 
       collapsibleCookie === 'icon' || 
       collapsibleCookie === 'none')
    ) {
      return collapsibleCookie
    }
    return defaultCollapsible
  })

  const setVariant = (variant: Variant) => {
    setVariantState(variant)
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, variant, LAYOUT_COOKIE_MAX_AGE)
  }

  const setCollapsible = (collapsible: Collapsible) => {
    setCollapsibleState(collapsible)
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, collapsible, LAYOUT_COOKIE_MAX_AGE)
  }

  const resetLayout = () => {
    setVariantState(defaultVariant)
    setCollapsibleState(defaultCollapsible)
    removeCookie(LAYOUT_VARIANT_COOKIE_NAME)
    removeCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME)
  }

  const value = {
    variant,
    setVariant,
    collapsible,
    setCollapsible,
    resetLayout,
  }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

