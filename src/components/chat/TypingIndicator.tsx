"use client";

import { motion } from "framer-motion";
import { Agent } from "@/types";
import React from "react";
import { BookOpen } from "lucide-react";

interface TypingIndicatorProps {
  agent?: Agent | null;
}

export function TypingIndicator({ agent }: TypingIndicatorProps) {
  // Mensagens personalizadas por tipo de agente
  const getTypingMessage = (agent?: Agent | null): string => {
    if (!agent) return "Pensando...";
    
    const messages: Record<string, string[]> = {
      'content-creator': ['Criando conteúdo...', 'Organizando ideias...', 'Estruturando artigo...'],
      'copywriter': ['Criando copy persuasiva...', 'Pensando em conversão...', 'Elaborando texto...'],
      'ux-writer': ['Pensando na experiência...', 'Criando microtextos...', 'Otimizando interface...'],
      'scriptwriter': ['Desenvolvendo roteiro...', 'Criando diálogos...', 'Estruturando cenas...'],
      'developer': ['Analisando código...', 'Pensando em soluções...', 'Estruturando lógica...'],
      'designer': ['Criando conceitos...', 'Pensando no design...', 'Organizando layouts...'],
      'default': ['Analisando sua solicitação...', 'Organizando resposta...', 'Processando informações...']
    };
    
    const agentMessages = messages[agent.id] || messages.default;
    const randomIndex = Math.floor(Math.random() * agentMessages.length);
    return agentMessages[randomIndex];
  };

  return (
    <div className="flex gap-4">
      {agent && (
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
          <div className="translate-y-px">
            {React.isValidElement(agent.icon) ? agent.icon : <BookOpen className="w-5 h-5" />}
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2 text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>{getTypingMessage(agent)}</span>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex gap-1"
          >
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}