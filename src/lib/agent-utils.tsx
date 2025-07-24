import { Agent } from '@/types';
import { getIconComponent } from '@/lib/icons';
import React from 'react';

// Função para processar agentes e adicionar ícones corretos
export function processAgentsWithIcons(agents: Agent[]): Agent[] {
  return agents.map(agent => {
    // Usar o ícone correto baseado no iconName do agente
    const IconComponent = getIconComponent(agent.iconName || 'lightbulb');
    
    return {
      ...agent,
      // Renderizar o ícone correto para cada agente sem estilos específicos
      // Os estilos serão aplicados nos componentes individuais
      icon: React.createElement(IconComponent)
    };
  });
}
