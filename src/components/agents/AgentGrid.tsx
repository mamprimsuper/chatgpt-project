"use client";

import { motion } from "framer-motion";
import { Agent } from "@/types";
import { BookOpen } from "lucide-react";
import React from "react";

interface AgentCardProps {
  agent: Agent;
  index: number;
  onSelect: (agent: Agent) => void;
}

function AgentCard({ agent, index, onSelect }: AgentCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(agent)}
      className="group relative p-5 rounded-xl border border-zinc-800/50 hover:border-zinc-600/50 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all duration-300 text-left overflow-hidden aspect-[4/3] backdrop-blur-sm"
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        rotateX: 5,
        rotateY: 5
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      style={{ perspective: "1000px" }}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
      
      {/* Border glow */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} 
           style={{ padding: '1px', background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className={`p-2.5 rounded-lg bg-gradient-to-br ${agent.color} text-white shadow-lg flex-shrink-0 ring-1 ring-white/20`}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Correção: Renderizar o ícone corretamente */}
            {React.isValidElement(agent.icon) ? agent.icon : <BookOpen className="w-5 h-5" />}
          </motion.div>
          <div className="min-w-0">
            <motion.h3 
              className="text-sm font-bold leading-tight text-white group-hover:text-white transition-colors"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {agent.name}
            </motion.h3>
            <motion.p 
              className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors"
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
            >
              {agent.speciality}
            </motion.p>
          </div>
        </div>
        
        <motion.p 
          className="text-xs text-zinc-400 leading-relaxed flex-1 group-hover:text-zinc-300 transition-colors"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
        >
          {agent.description}
        </motion.p>

        <motion.div 
          className="flex items-center text-zinc-500 group-hover:text-white transition-colors mt-3"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
        >
          <span className="text-xs font-medium">Conversar</span>
          <motion.div
            className="ml-2"
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            →
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(i) * 20}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-xl border border-zinc-800/50 bg-zinc-950/50 aspect-[4/3] animate-pulse"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-zinc-800 rounded" />
              <div className="h-2 w-16 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-zinc-800 rounded" />
            <div className="h-2 w-3/4 bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface AgentGridProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  loading?: boolean;
}

export function AgentGrid({ agents, onSelectAgent, loading = false }: AgentGridProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto"
    >
      {agents.map((agent, index) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          index={index}
          onSelect={onSelectAgent}
        />
      ))}
    </motion.div>
  );
}