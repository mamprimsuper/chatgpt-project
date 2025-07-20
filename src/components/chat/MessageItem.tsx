"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Message, Agent } from "@/types";
import { ArtifactPreview } from "./ArtifactPreview";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useRef } from "react";

interface MessageItemProps {
  message: Message;
  agent?: Agent | null;
  isLast?: boolean;
  onArtifactOpen?: (artifact: any, rect: DOMRect) => void;
}

export function MessageItem({ message, agent, isLast, onArtifactOpen }: MessageItemProps) {
  const handleArtifactOpen = (rect: DOMRect) => {
    if (message.artifact && onArtifactOpen) {
      onArtifactOpen(message.artifact, rect);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-start gap-4 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {message.role === "assistant" && agent && (
        <div 
          className={`p-2.5 rounded-xl bg-gradient-to-br ${agent.color} text-white flex-shrink-0 shadow-lg ring-1 ring-white/10`}
        >
          {agent.icon}
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.role === "user" ? "order-1" : ""}`}>
        {message.role === "user" ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl px-5 py-4 bg-white text-black shadow-lg border border-zinc-200"
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.3 }}
              className="text-xs mt-3 opacity-60"
            >
              {message.timestamp.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </motion.p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <MarkdownRenderer content={message.content} isLast={isLast} />
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="text-xs mt-4 text-zinc-500"
              >
                {message.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </motion.p>
            </motion.div>
            
            {message.artifact && (
              <ArtifactPreview
                artifact={message.artifact}
                onOpen={handleArtifactOpen}
                agentColor={agent?.color}
              />
            )}
          </div>
        )}
      </div>

      {message.role === "user" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="order-2"
        >
          <Avatar className="w-9 h-9 mt-1 flex-shrink-0 ring-2 ring-white/10">
            <AvatarFallback className="bg-zinc-800 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
}