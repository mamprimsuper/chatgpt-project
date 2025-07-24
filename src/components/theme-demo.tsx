"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Palette } from "lucide-react"

export function ThemeDemo() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-card border border-border shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Preview dos Temas</h3>
        <span className="text-sm text-muted-foreground">
          Tema atual: {theme === 'dark' ? '🌙 Escuro' : theme === 'light' ? '☀️ Claro' : '💻 Sistema'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Button 
          variant={theme === 'dark' ? 'default' : 'outline'}
          onClick={() => setTheme('dark')}
          className="gap-2"
        >
          <Moon className="w-4 h-4" />
          Escuro
        </Button>
        
        <Button 
          variant={theme === 'light' ? 'default' : 'outline'}
          onClick={() => setTheme('light')}
          className="gap-2"
        >
          <Sun className="w-4 h-4" />
          Claro
        </Button>
        
        <Button 
          variant={theme === 'system' ? 'default' : 'outline'}
          onClick={() => setTheme('system')}
          className="gap-2"
        >
          <Monitor className="w-4 h-4" />
          Sistema
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Cores primárias</h4>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded bg-background border border-border"></div>
            <div className="w-8 h-8 rounded bg-foreground"></div>
            <div className="w-8 h-8 rounded bg-primary"></div>
            <div className="w-8 h-8 rounded bg-muted"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Preview de card</h4>
          <div className="p-3 rounded-lg bg-accent border border-border">
            <p className="text-xs text-accent-foreground">
              Exemplo de card com tema aplicado
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 