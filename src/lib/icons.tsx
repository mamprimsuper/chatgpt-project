import React from 'react';
import { 
  Lightbulb,
  Code,
  PenTool,
  BarChart3,
  Camera,
  Edit3,
  Type,
  Share2,
  BookOpen,
  Video,
  Megaphone,
  Palette,
  Search,
  Mail,
  TrendingUp,
  Users,
  Brain,
  Sparkles,
  Zap,
  Target,
  ShoppingCart,
  Heart,
  MessageSquare,
  FileText,
  LucideIcon
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  'lightbulb': Lightbulb,
  'code': Code,
  'pen-tool': PenTool,
  'bar-chart-3': BarChart3,
  'camera': Camera,
  'edit-3': Edit3,
  'type': Type,
  'share-2': Share2,
  'book-open': BookOpen,
  'video': Video,
  'megaphone': Megaphone,
  'palette': Palette,
  'search': Search,
  'mail': Mail,
  'trending-up': TrendingUp,
  'users': Users,
  'brain': Brain,
  'sparkles': Sparkles,
  'zap': Zap,
  'target': Target,
  'shopping-cart': ShoppingCart,
  'heart': Heart,
  'message-square': MessageSquare,
  'file-text': FileText,
};

// Função para resolver ícone por nome
export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Lightbulb; // Fallback para Lightbulb
}

// Função para renderizar ícone - SEMPRE retorna um elemento React válido
export function renderIcon(iconName: string, props: any = {}) {
  const IconComponent = getIconComponent(iconName);
  return React.createElement(IconComponent, props);
}