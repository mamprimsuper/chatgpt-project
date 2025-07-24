"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Sparkles, BookOpen } from "lucide-react";
import { Agent } from "@/types";
import React from "react";

interface AgentWelcomeProps {
  agent: Agent;
  onBack: () => void;
  onStartChat: (initialMessage?: string) => void;
}

export function AgentWelcome({ agent, onBack, onStartChat }: AgentWelcomeProps) {
  const [input, setInput] = useState("");

  const handleSuggestionClick = (suggestion: string) => {
    onStartChat(suggestion);
  };

  const handleCustomMessage = () => {
    if (input.trim()) {
      onStartChat(input);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
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
              <h1 className="text-lg font-semibold text-foreground">{agent.name}</h1>
              <p className="text-xs text-muted-foreground">{agent.speciality}</p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-background">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${agent.color} opacity-5 dark:opacity-5 rounded-full blur-3xl`} />
          <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br ${agent.color} opacity-10 dark:opacity-10 rounded-full blur-2xl`} />
        </div>

        <div className="relative z-10 w-full max-w-3xl">
          {/* Welcome Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="text-center mb-8"
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-4xl font-bold text-foreground">
                Em que posso ajudar?
              </h2>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
            
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Especialista em{" "}
              <span className={`font-semibold bg-gradient-to-r ${agent.color} bg-clip-text text-transparent`}>
                {agent.speciality}
              </span>
            </motion.p>
          </motion.div>

          {/* Suggestions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8"
          >
            {agent.suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="group p-6 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-accent/50 transition-all duration-300 text-left relative overflow-hidden shadow-sm hover:shadow-md"
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {/* Subtle glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <p className="text-sm text-foreground group-hover:text-foreground transition-colors leading-relaxed">
                    {suggestion}
                  </p>
                  
                  <motion.div
                    className="mt-3 flex items-center text-muted-foreground group-hover:text-foreground transition-colors"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xs">Experimentar</span>
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Custom Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full"
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${agent.color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
              
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ou digite sua pergunta personalizada..."
                  className="w-full pr-16 py-6 text-base rounded-2xl bg-background border-border focus:border-primary min-h-[60px] transition-all duration-300 shadow-sm"
                />
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Button
                    onClick={handleCustomMessage}
                    disabled={!input.trim()}
                    size="icon"
                    className={`h-10 w-10 transition-all duration-300 ${
                      input.trim()
                        ? `bg-gradient-to-r ${agent.color} hover:shadow-lg text-white`
                        : 'bg-muted cursor-not-allowed text-muted-foreground'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-muted-foreground">
              💡 Dica: Seja específico sobre o que você precisa para obter a melhor resposta
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}