"use client";

import { motion } from "framer-motion";
import { Agent } from "@/types";

interface TypingIndicatorProps {
  agent?: Agent | null;
}

export function TypingIndicator({ agent }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start gap-4"
    >
      {agent && (
        <motion.div 
          className={`p-2.5 rounded-xl bg-gradient-to-br ${agent.color} text-white flex-shrink-0 shadow-lg ring-1 ring-white/10`}
          animate={{ 
            boxShadow: [
              "0 4px 20px rgba(0,0,0,0.3)",
              "0 8px 30px rgba(0,0,0,0.4)",
              "0 4px 20px rgba(0,0,0,0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {agent.icon}
        </motion.div>
      )}
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-zinc-400 font-medium">
            {agent?.name || 'Assistente'} está digitando
          </span>
          <div className="flex space-x-1">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-zinc-400 to-zinc-300 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          className="h-4 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 rounded opacity-30 mb-2"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: "200% 100%",
            width: "200px"
          }}
        />
        <motion.div
          className="h-4 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 rounded opacity-20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.3
          }}
          style={{
            backgroundSize: "200% 100%",
            width: "150px"
          }}
        />
      </div>
    </motion.div>
  );
}