export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  artifact?: Artifact;
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
  greeting: string;
  suggestions: string[];
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
}

export interface Document {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}