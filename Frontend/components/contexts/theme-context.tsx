"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextType = {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system")
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

    // Load theme from localStorage on mount
    useEffect(() => {
        const storedTheme = localStorage.getItem("scar-theme") as Theme | null
        if (storedTheme) {
            setThemeState(storedTheme)
        }
    }, [])

    // Update resolved theme based on system preference
    useEffect(() => {
        const updateResolvedTheme = () => {
            if (theme === "system") {
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
                setResolvedTheme(systemTheme)
            } else {
                setResolvedTheme(theme as "light" | "dark")
            }
        }

        updateResolvedTheme()

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handler = () => updateResolvedTheme()
        mediaQuery.addEventListener("change", handler)

        return () => mediaQuery.removeEventListener("change", handler)
    }, [theme])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(resolvedTheme)
    }, [resolvedTheme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem("scar-theme", newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
