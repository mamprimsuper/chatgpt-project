import { DbAgent } from '@/lib/supabase/types';

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  artifact?: Artifact;
  _isNew?: boolean; // Flag interna para controlar streaming
}

export interface Artifact {
  id: string;
  type: "code" | "document" | "html" | "react" | "text";
  title: string;
  content: string;
  language?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  speciality: string;
  icon: React.ReactNode;
  color: string;
  greeting?: string;
  suggestions: string[];
  // Novos campos para agentes dinâmicos
  systemPrompt?: string;
  category?: string;
  premiumTier?: number;
  active?: boolean | 'coming_soon';
  iconName?: string; // Nome do ícone do banco de dados
}

export interface Chat {
  id: string;
  title: string;
  agentId: string;
  lastMessage: string;
  timestamp: Date;
}

export type AppState = "agent-selection" | "agent-welcome" | "chat";

// Novos tipos para o sistema de artefatos avançado
export type ArtifactKind = 'text' | 'code' | 'image' | 'sheet';

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: 'streaming' | 'idle';
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  scrollPosition?: number; // Adicionar propriedade para salvar posição do scroll
}

export interface Document {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Utility function para converter DbAgent para Agent
export function dbAgentToAgent(dbAgent: DbAgent): Agent {
  const suggestions = Array.isArray(dbAgent.suggestions) 
    ? dbAgent.suggestions as string[]
    : [];

  return {
    id: dbAgent.id,
    name: dbAgent.name,
    description: dbAgent.description || '',
    speciality: dbAgent.speciality || '',
    icon: null, // Não usado mais - iconName é usado diretamente
    color: dbAgent.color,
    suggestions,
    systemPrompt: dbAgent.system_prompt,
    category: dbAgent.category,
    premiumTier: dbAgent.premium_tier,
    active: dbAgent.active,
    iconName: dbAgent.icon_name,
  };
}