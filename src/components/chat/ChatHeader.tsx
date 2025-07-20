"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, Share2 } from "lucide-react";
import { Agent } from "@/types";

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
      className="flex items-center justify-between p-4 border-b border-zinc-800/50 backdrop-blur-sm bg-black/20"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg ring-1 ring-white/10`}>
            {agent.icon}
          </div>
          <div>
            <motion.h1 
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {agent.name}
            </motion.h1>
            <motion.p 
              className="text-xs text-zinc-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {agent.speciality}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/70 backdrop-blur-sm transition-all duration-200"
          >
            Modelo GPT-4
            <ChevronDown className="w-3 h-3" />
          </Button>
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
            className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onSettings}
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}