"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Share2, BookOpen } from "lucide-react";
import { Agent } from "@/types";
import React from "react";

interface ChatHeaderProps {
  agent?: Agent | null;
  onShare?: () => void;
  onSettings?: () => void;
}

export function ChatHeader({ agent, onShare, onSettings }: ChatHeaderProps) {
  if (!agent) return null;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 border-b border-border"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg ring-1 ring-white/10 flex items-center justify-center`}>
            {React.isValidElement(agent.icon) ? 
              React.cloneElement(agent.icon as React.ReactElement, { 
                className: "w-6 h-6",
                style: { color: 'white' }
              }) : 
              <BookOpen className="w-6 h-6 text-white" />
            }
          </div>
          <div>
            <motion.h1 
              className="text-lg font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {agent.name}
            </motion.h1>
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {agent.speciality}
            </motion.p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onShare}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onSettings}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}