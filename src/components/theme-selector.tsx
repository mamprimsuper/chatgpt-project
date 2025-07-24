"use client"

import * as React from "react"
import { Monitor, Moon, Sun, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const themes = [
  {
    name: "light",
    label: "Claro",
    icon: Sun,
  },
  {
    name: "dark", 
    label: "Escuro",
    icon: Moon,
  },
  {
    name: "system",
    label: "Sistema",
    icon: Monitor,
  },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 px-2 w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent">
        <Sun className="h-4 w-4 mr-2" />
        <span className="text-sm">Tema</span>
      </Button>
    )
  }

  const currentTheme = themes.find(t => t.name === theme) || themes[2]
  const CurrentIcon = currentTheme.icon

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2 w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
      >
        <CurrentIcon className="h-4 w-4 mr-2" />
        <span className="text-sm">{currentTheme.label}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.1 }}
              className="absolute bottom-full left-0 mb-2 w-full z-50"
            >
              <div className="bg-popover border border-border rounded-md shadow-lg p-1 backdrop-blur-sm">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon
                  const isSelected = theme === themeOption.name
                  
                  return (
                    <button
                      key={themeOption.name}
                      onClick={() => {
                        setTheme(themeOption.name)
                        setIsOpen(false)
                      }}
                      className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-foreground"
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {themeOption.label}
                      </div>
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 