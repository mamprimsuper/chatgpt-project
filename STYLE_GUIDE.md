# 🎨 Guia de Estilo - ChatGPT Project

## 🎯 Princípios de Design

### 1. **Dark Mode Nativo**
- Background principal: `bg-black` ou `bg-zinc-950`
- Cards/Containers: `bg-zinc-900/50` com `backdrop-blur`
- Borders: `border-zinc-800/50`
- Texto principal: `text-white`
- Texto secundário: `text-zinc-400`

### 2. **Gradientes por Agente**
Cada agente tem seu gradiente único definido em `agents.tsx`:
```tsx
color: "from-blue-500 to-purple-600" // Exemplo
```

### 3. **Animações Framer Motion**
Padrões de animação consistentes:

```tsx
// Fade in com movimento
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}

// Hover em botões
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Entrada escalonada
transition={{ delay: index * 0.05 }}
```

## 🧩 Componentes Base

### Botões
```tsx
// Primário (com gradiente do agente)
className={`bg-gradient-to-r ${agent.color} hover:shadow-lg hover:shadow-black/25`}

// Secundário
className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50"

// Ghost
className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
```

### Cards
```tsx
className="rounded-xl border border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm p-4"
```

### Inputs
```tsx
className="bg-zinc-900/50 border border-zinc-800/50 focus:border-zinc-600 rounded-lg"
```

## 🎭 Estados Visuais

### Loading
- Usar `Loader2` do lucide-react com animação de rotação
- Shimmer effects para skeleton screens

### Hover
- Escala sutil: `scale(1.02)`
- Glow effect com opacity baixa
- Transições suaves: `transition-all duration-300`

### Focus
- Ring sutil: `focus:ring-2 focus:ring-white/10`
- Border mais clara: `focus:border-zinc-600`

## 📱 Responsividade

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Padrões
```tsx
// Padding responsivo
className="p-4 md:p-6 lg:p-8"

// Grid responsivo
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Text size responsivo
className="text-sm md:text-base lg:text-lg"
```

## ✨ Efeitos Especiais

### Glow Effect
```tsx
<div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-20 blur-xl`} />
```

### Glass Effect
```tsx
className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50"
```

### Particles (para elementos especiais)
```tsx
{[...Array(6)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-1 h-1 bg-white rounded-full"
    animate={{
      y: [-10, -20, -10],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: i * 0.2,
    }}
  />
))}
```

## 🔤 Tipografia

### Hierarquia
- Títulos principais: `text-4xl font-bold`
- Subtítulos: `text-2xl font-semibold`
- Body: `text-base`
- Small: `text-sm`
- Extra small: `text-xs`

### Gradientes em texto
```tsx
className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
```

## 🎯 Melhores Práticas

1. **Sempre use animações suaves** - Evite movimentos bruscos
2. **Mantenha consistência** - Use os mesmos padrões em todo o app
3. **Pense em acessibilidade** - Contraste adequado, focus states claros
4. **Performance primeiro** - Use `memo` para componentes pesados
5. **Mobile-first** - Design para mobile e expanda para desktop

## 🚀 Exemplo de Novo Componente

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  agent: Agent;
  className?: string;
}

export function MyComponent({ agent, className }: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-xl border border-zinc-800/50",
        "bg-zinc-950/50 backdrop-blur-sm p-4",
        "transition-all duration-300",
        className
      )}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color}`}>
        {agent.icon}
      </div>
      {/* Conteúdo */}
    </motion.div>
  );
}
```

---

Seguindo este guia, manteremos a consistência visual em todo o projeto! 🎨✨