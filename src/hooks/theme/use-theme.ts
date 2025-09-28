import { useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "system"
  )
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">()

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
      return
    }
    
    root.classList.add(theme)
    setResolvedTheme(theme)
  }, [theme])

  const setMode = (theme: Theme) => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  return {
    theme,
    setTheme: setMode,
    resolvedTheme,
    isDarkMode: resolvedTheme === "dark",
    isLightMode: resolvedTheme === "light",
  }
}