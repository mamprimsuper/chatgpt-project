"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Message, Agent } from "@/types";
import { formatMarkdown } from "@/lib/markdown";
import { ArtifactViewer } from "./ArtifactViewer";

interface ChatMessageProps {
  message: Message;
  agent?: Agent;
  isLoading?: boolean;
}

export function ChatMessage({ message, agent, isLoading = false }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.role === "assistant" && !isLoading) {
      setIsTyping(true);
      setDisplayedContent("");
      
      let index = 0;
      const content = message.content;
      
      const typeWriter = () => {
        if (index < content.length) {
          setDisplayedContent(prev => prev + content.charAt(index));
          index++;
          setTimeout(typeWriter, 20); // Velocidade da digitação
        } else {
          setIsTyping(false);
        }
      };
      
      setTimeout(typeWriter, 300); // Delay inicial
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.role, isLoading]);

  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex items-start gap-4 group ${isUser ? "justify-end" : ""}`}
    >
      {!isUser && agent && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className={`p-2.5 rounded-xl bg-gradient-to-br ${agent.color} text-white flex-shrink-0 shadow-lg`}
        >
          {agent.icon}
        </motion.div>
      )}
      
      <div className={`max-w-[85%] ${isUser ? "order-1" : ""}`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm relative overflow-hidden ${
            isUser
              ? "bg-white text-black border border-zinc-200"
              : "bg-zinc-900/90 text-white border border-zinc-700/50"
          }`}
        >
          {/* Gradiente sutil de fundo para mensagens do assistente */}
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none" />
          )}
          
          <div className="relative z-10">
            {message.role === "assistant" ? (
              <div 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatMarkdown(displayedContent)
                }}
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {message.content}
              </p>
            )}
            
            {/* Cursor de digitação */}
            {isTyping && message.role === "assistant" && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-white ml-1"
              />
            )}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-xs mt-3 opacity-60"
          >
            {message.timestamp.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </motion.p>
        </motion.div>
        
        {/* Artefatos */}
        {message.artifact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <ArtifactViewer artifact={message.artifact} />
          </motion.div>
        )}
      </div>

      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="order-2"
        >
          <Avatar className="w-9 h-9 mt-1 flex-shrink-0 shadow-lg border-2 border-zinc-700">
            <AvatarFallback className="bg-zinc-800 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
}