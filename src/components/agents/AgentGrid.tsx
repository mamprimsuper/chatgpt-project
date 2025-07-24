"use client";

import { motion } from "framer-motion";
import { Agent } from "@/types";
import { BookOpen } from "lucide-react";
import { getIconComponent } from "@/lib/icons";
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
      className="group relative p-5 rounded-xl border border-border hover:border-border/70 bg-card hover:bg-accent/50 transition-all duration-300 text-left overflow-hidden aspect-[4/3] backdrop-blur-sm shadow-sm hover:shadow-md"
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
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
      
      {/* Border glow */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300`} 
           style={{ padding: '1px', background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} text-white shadow-lg flex items-center justify-center flex-shrink-0 ring-1 ring-white/20`}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {(() => {
              const IconComponent = getIconComponent(agent.iconName || 'lightbulb');
              return <IconComponent className="w-6 h-6 text-white" />;
            })()}
          </motion.div>
          <div className="min-w-0">
            <motion.h3 
              className="text-sm font-bold leading-tight text-foreground group-hover:text-foreground transition-colors"
              initial={{ opacity: 0.9 }}
              whileHover={{ opacity: 1 }}
            >
              {agent.name}
            </motion.h3>
            <motion.p 
              className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {agent.speciality}
            </motion.p>
          </div>
        </div>
        
        <motion.p 
          className="text-xs text-muted-foreground leading-relaxed flex-1 group-hover:text-foreground/80 transition-colors"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {agent.description}
        </motion.p>

        <motion.div 
          className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors mt-3"
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
            className="absolute w-1 h-1 bg-foreground/50 rounded-full"
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
          className="p-5 rounded-xl border border-border bg-card aspect-[4/3] animate-pulse"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-2 w-16 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-muted rounded" />
            <div className="h-2 w-3/4 bg-muted rounded" />
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