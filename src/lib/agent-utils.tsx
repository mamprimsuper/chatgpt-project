import { Agent } from '@/types';
import { BookOpen } from 'lucide-react';

// Função para processar agentes e adicionar ícones - VERSÃO SIMPLIFICADA
export function processAgentsWithIcons(agents: Agent[]): Agent[] {
  return agents.map(agent => ({
    ...agent,
    // Sempre usar BookOpen como fallback para evitar problemas
    icon: <BookOpen className="w-5 h-5" />
  }));
}
